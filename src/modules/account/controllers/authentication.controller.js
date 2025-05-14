import ApiResponse from "../../../utils/apiResponse.js";
import authenticationService from "../services/authentication.service.js";

class AuthenticationController {
    async login(req, res, next) {
        try {
            const response = await authenticationService.login(req.body);
            new ApiResponse(res).success(response, 'Đăng nhập thành công');
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const account = await authenticationService.resetPassword(req.body);
            if (!account) throw new Error('Không tìm thấy tài khoản');
            new ApiResponse(res).success(account, 'Đặt lại mật khẩu thành công');
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const account = await authenticationService.forgotPassword(req.body);
            new ApiResponse(res).success(account, 'Đã gửi link đặt lại mật khẩu');
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res, next) {
        try {
            // Lấy user từ request (sau khi authenticated)
            const userId = req.user.id;

            // Gọi service thay đổi mật khẩu
            const result = await authenticationService.changePassword({
                userId,
                ...req.body
            });

            new ApiResponse(res).success(result, 'Đổi mật khẩu thành công');
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthenticationController();