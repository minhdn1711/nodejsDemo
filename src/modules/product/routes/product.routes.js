import express from 'express';
const router = express.Router();
import ProductController from '../controllers/product.controller.js';
import { validate } from '../../../middlewares/validate.js';
import {
    createProductSchema,
    updateProductSchema,
    productIdSchema
} from '../validations/product.validation.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

// Áp dụng middleware cho tất cả các route của product
router.use(authMiddleware);
// Validate params cho các route có :id
router.param('id', validate(productIdSchema, { location: 'params' }));
// POST /products - Tạo mới sản phẩm
router.post('/', validate(createProductSchema, { location: 'body' }), ProductController.createProduct);

// GET /products - Danh sách sản phẩm (có phân trang)
router.get('/', ProductController.listProducts);

// GET /products/:id - Chi tiết sản phẩm
router.get('/:id', ProductController.getProduct);

// PUT /products/:id - Cập nhật sản phẩm
router.put('/:id', validate(updateProductSchema, { location: 'body' }), ProductController.updateProduct);

// DELETE /products/:id - Xóa mềm sản phẩm
router.delete('/:id', ProductController.deleteProduct);

export default router;
