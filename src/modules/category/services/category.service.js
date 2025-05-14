import Category from '../models/category.model.js';

class CategoryService {
    // CREATE
    async createCategory(categoryData) {
        return await Category.create(categoryData);
    }

    // READ
    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async listCategories({ page = 1, limit = 2, search = '' }) {
        const query = { isActive: true };
        if (search) {
            query.$text = { $search: search };
        }

        // Thực hiện song song 2 query: đếm tổng và lấy dữ liệu
        const [total, categories] = await Promise.all([
            Category.countDocuments(query),
            Category.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
        ]);

        return {
            categories,
            pagination: {
                currentPage: page,
                pageSize: limit,
                totalItems: total,
                currentPageItems: categories.length,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    // UPDATE
    async updateCategory(id, updateData) {
        return await Category.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
    }

    // SOFT DELETE
    async deleteCategory(id) {
        return this.updateCategory(id, { isActive: false });
    }
}

export default new CategoryService();
