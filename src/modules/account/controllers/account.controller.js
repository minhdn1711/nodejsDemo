import accountService from '../services/account.service.js';
import ApiResponse from '../../../utils/apiResponse.js';

class AccountController {
    async createAccount(req, res, next) {
        try {
            const account = await accountService.createAccount(req.body);
            new ApiResponse(res).created(account, 'Tạo tài khoản thành công');
        } catch (error) {
            next(error);
        }
    }

    async getAccount(req, res, next) {
        try {
            const account = await accountService.getAccountById(req.params.id);
            if (!account) throw new Error('Không tìm thấy tài khoản');
            new ApiResponse(res).success(account);
        } catch (error) {
            next(error);
        }
    }

    async listAccounts(req, res, next) {
        try {
            const { accounts, pagination } = await accountService.listAccounts({
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 2,
                search: req.query.search || ''
            });
            // new ApiResponse(res).success(accounts);
            new ApiResponse(res).success({ accounts, pagination: pagination });
        } catch (error) {
            next(error);
        }
    }

    async updateAccount(req, res, next) {
        try {
            const account = await accountService.updateAccount(
                req.params.id,
                req.body
            );
            new ApiResponse(res).success(account, 'Cập nhật thành công');
        } catch (error) {
            next(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            await accountService.deleteAccount(req.params.id);
            new ApiResponse(res).success(null, 'Đã xóa tài khoản');
        } catch (error) {
            next(error);
        }
    }
}

export default new AccountController();


