import productService from '../services/product.service.js';
import ApiResponse from '../../../utils/apiResponse.js';

class ProductController {
    async createProduct(req, res, next) {
        try {
            const product = await productService.createProduct(req.body);
            new ApiResponse(res).created(product, 'Tạo sản phẩm thành công');
        } catch (error) {
            next(error);
        }
    }

    async getProduct(req, res, next) {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) throw new Error('Không tìm thấy sản phẩm');
            new ApiResponse(res).success(product);
        } catch (error) {
            next(error);
        }
    }

    async listProducts(req, res, next) {
        try {
            const { products, pagination } = await productService.listProducts({
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 2,
                search: req.query.search || ''
            });
            // new ApiResponse(res).success(products);
            new ApiResponse(res).success({ products, pagination: pagination });
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const product = await productService.updateProduct(
                req.params.id,
                req.body
            );
            new ApiResponse(res).success(product, 'Cập nhật thành công');
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            await productService.deleteProduct(req.params.id);
            new ApiResponse(res).success(null, 'Đã xóa sản phẩm');
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();


