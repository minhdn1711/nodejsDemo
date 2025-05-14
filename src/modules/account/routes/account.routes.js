import express from 'express';
const router = express.Router();
import AccountController from '../controllers/account.controller.js';
import { validate } from '../../../middlewares/validate.js';
import {
    createAccountSchema,
    updateAccountSchema,
    accountIdSchema
} from '../validations/account.validation.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

// Áp dụng middleware cho tất cả các route của product
router.use(authMiddleware);
// Validate params cho các route có :id
router.param('id', validate(accountIdSchema, { location: 'params' }));
// POST /accounts - Tạo mới sản phẩm
router.post('/', validate(createAccountSchema, { location: 'body' }), AccountController.createAccount);

// GET /accounts - Danh sách sản phẩm (có phân trang)
router.get('/', AccountController.listAccounts);

// GET /accounts/:id - Chi tiết sản phẩm
router.get('/:id', AccountController.getAccount);

// PUT /accounts/:id - Cập nhật sản phẩm
router.put('/:id', validate(updateAccountSchema, { location: 'body' }), AccountController.updateAccount);

// DELETE /accounts/:id - Xóa mềm sản phẩm
router.delete('/:id', AccountController.deleteAccount);

export default router;
