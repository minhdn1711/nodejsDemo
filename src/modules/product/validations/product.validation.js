import Joi from 'joi';
import { Types } from 'mongoose';

// Kiểm tra ObjectId hợp lệ
const isValidObjectId = (value, helpers) => {
    return Types.ObjectId.isValid(value) ? value : helpers.error('any.invalid');
};

export const createProductSchema = Joi.object({
    name: Joi.string()
        .max(100)
        .pattern(/^[\p{L}\s]+$/u) // Chỉ cho phép chữ và khoảng trắng
        .required()
        .messages({
            'string.empty': 'Tên sản phẩm không được trống',
            'string.max': 'Tên sản phẩm tối đa 100 ký tự'
        }),
    stock: Joi.number()
        .min(1)
        .precision(2)
        .required()
        .messages({
            'number.min': 'Giá tối thiểu 1'
        }),
    price: Joi.number()
        .min(1000)
        .precision(2)
        .required()
        .messages({
            'number.min': 'Giá tối thiểu 1.000đ'
        }),
    description: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional()
        .messages({
            'string.max': 'Mô tả sản phẩm tối đa 1000 ký tự'
        }),
    thumbnail: Joi.string()
        .allow(null, '')
        .optional(),
    category: Joi.string()
        .custom(isValidObjectId)
        .required(),
    isActive: Joi.boolean()
        .default(true) // Default to true if not provided
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
});

export const updateProductSchema = Joi.object({
    name: Joi.string()
        .max(100)
        .pattern(/^[\p{L}\s]+$/u) // Chỉ cho phép chữ và khoảng trắng
        .required()
        .messages({
            'string.empty': 'Tên sản phẩm không được trống',
            'string.max': 'Tên sản phẩm tối đa 100 ký tự'
        }),
    stock: Joi.number()
        .min(1)
        .precision(2)
        .required()
        .messages({
            'number.min': 'Giá tối thiểu 1'
        }),
    price: Joi.number()
        .min(1000)
        .precision(2)
        .required()
        .messages({
            'number.min': 'Giá tối thiểu 1.000đ'
        }),
    description: Joi.string()
        .max(1000)
        .allow(null, '')
        .optional()
        .messages({
            'string.max': 'Mô tả sản phẩm tối đa 1000 ký tự'
        }),
    thumbnail: Joi.string()
        .allow(null, '')
        .optional(),
    category: Joi.string()
        .custom(isValidObjectId)
        .required(),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
}).min(1).message('Cần ít nhất 1 trường để cập nhật');

// Schema cho các API khác
export const productIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
});

