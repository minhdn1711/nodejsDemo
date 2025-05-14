import Account from '../models/account.model.js';
import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_DIRS } from '../../../utils/constants.js';
import ApiError from '../../../utils/apiError.js';

class AccountService {

    //Tạo thư mục nếu chưa tồn tại
    async ensureDirectoryExists(directory) {
        try {
            fs.mkdir(directory, { recursive: true, mode: 0o755 });
        } catch (error) {
            console.error(`Lỗi tạo thư mục: ${directory}`, error);
        }
    }

    //Di chuyển ảnh từ thư mục tạm sang thư mục sản phẩm
    async moveAccountImage(tempImagePath) {
        // Kiểm tra file tồn tại
        if (!tempImagePath) {
            throw ApiError.badRequest('Đường dẫn ảnh không được để trống');
        }

        await this.ensureDirectoryExists(UPLOAD_DIRS['avatar']);

        // Lấy tên file từ đường dẫn temp
        const fileName = path.basename(tempImagePath);
        const destinationPath = path.join(UPLOAD_DIRS['avatar'], fileName);

        try {

            // Kiểm tra file nguồn có tồn tại không
            await fs.access(tempImagePath);

            // Sao chép file
            await fs.copyFile(tempImagePath, destinationPath);

            // Xóa file gốc
            await fs.unlink(tempImagePath);

            // Trả về đường dẫn tương đối để lưu vào database
            return `${UPLOAD_DIRS['avatar']}/${fileName}`;
        } catch (error) {
            throw ApiError.badRequest(`Không thể di chuyển ảnh: ${error.message}`);
        }
    }


    // CREATE
    async createAccount(accountData) {
        // Nếu có ảnh tạm, di chuyển ảnh
        if (accountData.avatar) {
            const finalThumbnailPath = await this.moveAccountImage(accountData.avatar);

            // Cập nhật thumbnail nếu di chuyển thành công
            if (finalThumbnailPath) {
                accountData.avatar = finalThumbnailPath;
            }
        }
        return await Account.create(accountData);
    }

    // READ
    async getAccountById(id) {
        return await Account.findById(id);
    }

    async listAccounts({ page = 1, limit = 2, search = '' }) {
        const query = { isActive: true };
        if (search) {
            query.$text = { $search: search };
        }
        // Thực hiện song song 2 query: đếm tổng và lấy dữ liệu
        const [total, accounts] = await Promise.all([
            Account.countDocuments(query),
            Account.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        return {
            accounts,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: total,
                currentPageItems: accounts.length,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // UPDATE
    async updateAccount(id, updateData) {
        if (updateData.avatar) {
            const finalThumbnailPath = await this.moveAccountImage(updateData.avatar);

            if (finalThumbnailPath) {
                updateData.avatar = finalThumbnailPath;
            }
        }

        return await Account.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    }

    // SOFT DELETE
    async deleteAccount(id) {
        return this.updateAccount(id, { isActive: false });
    }
}

export default new AccountService();
