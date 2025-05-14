import Product from '../models/product.model.js';
import path from 'path';
import fs from 'fs/promises';
import { UPLOAD_DIRS } from '../../../utils/constants.js';
import ApiError from '../../../utils/apiError.js';

class ProductService {

    // Tạo thư mục nếu chưa tồn tại
    async ensureDirectoryExists(directory) {
        try {
            fs.mkdir(directory, { recursive: true, mode: 0o755 });
        } catch (error) {
            console.error(`Lỗi tạo thư mục: ${directory}`, error);
        }
    }

    // Di chuyển ảnh từ thư mục tạm sang thư mục sản phẩm
    async moveProductImage(tempImagePath) {
        // Kiểm tra file tồn tại
        if (!tempImagePath) {
            throw ApiError.badRequest('Đường dẫn ảnh không được để trống');
        }

        await this.ensureDirectoryExists(UPLOAD_DIRS['product']);

        // Lấy tên file từ đường dẫn temp
        const fileName = path.basename(tempImagePath);
        const destinationPath = path.join(UPLOAD_DIRS['product'], fileName);

        try {

            // Kiểm tra file nguồn có tồn tại không
            await fs.access(tempImagePath);

            // Sao chép file
            await fs.copyFile(tempImagePath, destinationPath);

            // Xóa file gốc
            await fs.unlink(tempImagePath);

            // Trả về đường dẫn tương đối để lưu vào database
            return `${UPLOAD_DIRS['product']}/${fileName}`;
        } catch (error) {
            throw ApiError.badRequest(`Không thể di chuyển ảnh: ${error.message}`);
        }
    }


    // CREATE
    async createProduct(productData) {
        // Nếu có ảnh tạm, di chuyển ảnh
        if (productData.thumbnail) {
            const finalThumbnailPath = await this.moveProductImage(productData.thumbnail);

            // Cập nhật thumbnail nếu di chuyển thành công
            if (finalThumbnailPath) {
                productData.thumbnail = finalThumbnailPath;
            }
        }
        return await Product.create(productData);
    }

    // READ
    async getProductById(id) {
        return await Product.findById(id).populate('category', 'name description');
    }

    async listProducts({ page = 1, limit = 2, search = '' }) {
        const query = { isActive: true };
        if (search) {
            query.$text = { $search: search };
        }
        // Thực hiện song song 2 query: đếm tổng và lấy dữ liệu
        const [total, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('category')
        ]);

        return {
            products,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: total,
                currentPageItems: products.length,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // UPDATE
    async updateProduct(id, updateData) {
        if (updateData.thumbnail) {
            const finalThumbnailPath = await this.moveProductImage(updateData.thumbnail);

            if (finalThumbnailPath) {
                updateData.thumbnail = finalThumbnailPath;
            }
        }

        return await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    }

    // SOFT DELETE
    async deleteProduct(id) {
        return this.updateProduct(id, { isActive: false });
    }
}

export default new ProductService();
