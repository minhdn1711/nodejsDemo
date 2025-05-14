import Joi from 'joi';
import { Types } from 'mongoose';

// Kiểm tra ObjectId hợp lệ
const isValidObjectId = (value, helpers) => {
    return Types.ObjectId.isValid(value) ? value : helpers.error('any.invalid');
};

export const createCategorySchema = Joi.object({
    name: Joi.string()
        .max(100)
        .pattern(/^[\p{L}0-9\s]+$/u) // Chỉ cho phép chữ, số và khoảng trắng
        .required()
        .messages({
            'string.empty': 'Tên loại sản phẩm không được trống',
            'string.max': 'Tên loại sản phẩm tối đa 100 ký tự'
        }),
    description: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional()
        .messages({
            'string.max': 'Mô tả sản phẩm tối đa 1000 ký tự'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
});

export const updateCategorySchema = Joi.object({
    name: Joi.string()
        .max(100)
        .pattern(/^[\p{L}0-9\s]+$/u) // Chỉ cho phép chữ, số và khoảng trắng
        .required()
        .messages({
            'string.empty': 'Tên loại sản phẩm không được trống',
            'string.max': 'Tên loại sản phẩm tối đa 100 ký tự'
        }),
    description: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional()
        .messages({
            'string.max': 'Mô tả sản phẩm tối đa 1000 ký tự'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
}).min(1).message('Cần ít nhất 1 trường để cập nhật');

// Schema cho các API khác
export const categoryIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
});

