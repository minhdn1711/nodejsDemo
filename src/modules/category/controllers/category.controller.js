import categoryService from '../services/category.service.js';
import ApiResponse from '../../../utils/apiResponse.js';

class CategoryController {
    async createCategory(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);
            new ApiResponse(res).created(category, 'Tạo loại sản phẩm thành công');
        } catch (error) {
            next(error);
        }
    }

    async getCategory(req, res, next) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) throw new Error('Không tìm thấy loại sản phẩm');
            new ApiResponse(res).success(category);
        } catch (error) {
            next(error);
        }
    }

    async listCategories(req, res, next) {
        try {
            const { categories, pagination } = await categoryService.listCategories({
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 2,
                search: req.query.search || ''
            });
            new ApiResponse(res).success({ categories, pagination: pagination });
        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const category = await categoryService.updateCategory(
                req.params.id,
                req.body
            );
            new ApiResponse(res).success(category, 'Cập nhật thành công');
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            await categoryService.deleteCategory(req.params.id);
            new ApiResponse(res).success(null, 'Đã xóa loại sản phẩm');
        } catch (error) {
            next(error);
        }
    }
}

export default new CategoryController();
