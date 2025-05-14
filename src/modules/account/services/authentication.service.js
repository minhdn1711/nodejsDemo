import ApiError from "../../../utils/apiError.js";
import accountModel from "../models/account.model.js";
import crypto from 'crypto';
import emailService from '../../../utils/services/email.service.js'

class AuthenticationService {
    async login(body) {
        const { username, password } = body;
        // Tìm user và include password để verify
        const user = await accountModel.findOne({ username }).select('+password');

        if (!user) {
            throw ApiError.notFound('Tài khoản không tồn tại');
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw ApiError.badRequest('Mật khẩu không chính xác');
        }

        // Kiểm tra trạng thái tài khoản
        if (!user.isActive) {
            throw ApiError.badRequest('Tài khoản đã bị khóa');
        }

        // Cập nhật last login
        user.lastLogin = new Date();
        await user.save();

        // Tạo token
        const token = user.generateAuthToken();

        return {
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        };
    }

    // Middleware xác thực token
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await accountModel.findById(decoded.id);

            if (!user) {
                throw ApiError.unauthorized('Người dùng không tồn tại');
            }

            return user;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Token đã hết hạn');
            }
            throw ApiError.unauthorized('Xác thực không hợp lệ');
        }
    }

    // Quên mật khẩu
    async forgotPassword(body) {
        const { email } = body;

        const user = await accountModel.findOne({ email });
        if (!user) {
            throw ApiError.notFound('Không tìm thấy tài khoản');
        }

        // Tạo reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHashed = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Lưu token vào user
        user.passwordResetToken = resetTokenHashed;
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save();

        // Gửi email reset password
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        try {
            // Gửi email
            await emailService.sendResetPasswordEmail(user.email, resetURL);
            return {
                resetTokenExpires: user.passwordResetExpires
            };
        } catch (error) {
            // Nếu gửi email thất bại, xóa token
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();

            throw ApiError.internal('Không thể gửi email. Vui lòng thử lại sau.');
        }
    }

    // Reset mật khẩu
    async resetPassword(body) {
        const { token, newPassword, confirmNewPassword } = body;

        // Kiểm tra xác nhận mật khẩu (thêm một lớp kiểm tra)
        if (newPassword !== confirmNewPassword) {
            throw ApiError.badRequest('Xác nhận mật khẩu không khớp');
        }

        // Mã hóa token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        console.log('hashedToken' + hashedToken);

        // Tìm user
        const user = await accountModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // Kiểm tra token
        if (!user) {
            throw ApiError.badRequest('Token không hợp lệ hoặc đã hết hạn');
        }

        // Cập nhật mật khẩu
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return true;
    }

    async changePassword(body) {
        const { userId, currentPassword, newPassword, confirmNewPassword } = body;

        // Validate input
        if (newPassword !== confirmNewPassword) {
            throw ApiError.badRequest('Xác nhận mật khẩu mới không khớp');
        }

        // Tìm user và include password để verify
        const user = await accountModel.findById(userId).select('+password');

        if (!user) {
            throw ApiError.notFound('Người dùng không tồn tại');
        }

        // Kiểm tra mật khẩu hiện tại
        const isMatchCurrentPassword = await user.comparePassword(currentPassword);

        if (!isMatchCurrentPassword) {
            throw ApiError.badRequest('Mật khẩu hiện tại không chính xác');
        }

        // Kiểm tra mật khẩu mới không được trùng mật khẩu cũ
        const isMatchNewPassword = await user.comparePassword(newPassword);

        if (isMatchNewPassword) {
            throw ApiError.badRequest('Mật khẩu mới không được trùng mật khẩu cũ');
        }

        // Cập nhật mật khẩu
        user.password = newPassword;
        await user.save();

        // Gửi email thông báo (tùy chọn)
        // await this.sendPasswordChangeNotification(user);
        return true;
    }

}

export default new AuthenticationService();