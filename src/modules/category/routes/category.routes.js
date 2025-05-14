import express from 'express';
const router = express.Router();
import categoryController from '../controllers/category.controller.js';
import { validate } from '../../../middlewares/validate.js';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema
} from '../validations/category.validation.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

// Áp dụng middleware cho tất cả các route của product
router.use(authMiddleware);

// Validate params cho các route có :id
router.param('id', validate(categoryIdSchema, { location: 'params' }));
// POST /categories - Tạo mới loại sản phẩm
router.post('/', validate(createCategorySchema), categoryController.createCategory);

// GET /categories - Danh sách loại sản phẩm (có phân trang)
router.get('/', categoryController.listCategories);

// GET /categories/:id - Chi tiết loại sản phẩm
router.get('/:id', categoryController.getCategory);

// PUT /categories/:id - Cập nhật loại sản phẩm
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);

// DELETE /categories/:id - Xóa mềm loại sản phẩm
router.delete('/:id', categoryController.deleteCategory);

export default router;
