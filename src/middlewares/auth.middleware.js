import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import AccountModel from '../modules/account/models/account.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Kiểm tra header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw ApiError.unauthorized('Không tìm thấy token');
        }

        // 2. Kiểm tra định dạng Bearer
        if (!authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('Định dạng token không hợp lệ');
        }

        // 3. Tách token
        const token = authHeader.split(' ')[1];

        // 4. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 5. Tìm user từ ID trong token
        const user = await AccountModel.findById(decoded.id);

        if (!user) {
            throw ApiError.unauthorized('Người dùng không tồn tại');
        }

        // 6. Gắn thông tin user vào request
        req.user = user;

        // 7. Cho phép đi tiếp
        next();
    } catch (error) {
        // Xử lý các lỗi token
        if (error.name === 'JsonWebTokenError') {
            return next(ApiError.unauthorized('Token không hợp lệ'));
        }

        if (error.name === 'TokenExpiredError') {
            return next(ApiError.unauthorized('Token đã hết hạn'));
        }

        next(error);
    }
};

export default authMiddleware;
