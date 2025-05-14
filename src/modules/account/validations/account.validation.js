import Joi from 'joi';
import { Types } from 'mongoose';

// Kiểm tra ObjectId hợp lệ
const isValidObjectId = (value, helpers) => {
    return Types.ObjectId.isValid(value) ? value : helpers.error('any.invalid');
};

export const createAccountSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
            'string.base': 'Tên đăng nhập phải là chuỗi',
            'string.empty': 'Tên đăng nhập không được để trống',
            'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
            'string.max': 'Tên đăng nhập không được vượt quá 50 ký tự',
            'string.pattern.base': 'Tên đăng nhập chỉ được chứa chữ cái, số và gạch dưới'
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'vn'] } })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống'
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
            'string.pattern.base': 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Mật khẩu xác nhận không khớp'
        }),

    fullName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Tên đầy đủ phải có ít nhất 2 ký tự',
            'string.max': 'Tên đầy đủ không được vượt quá 100 ký tự'
        }),
    avatar: Joi.string()
        .allow(null, '')
        .optional(),
    isActive: Joi.boolean()
        .default(true) // Default to true if not provided
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
});

export const updateAccountSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z0-9_]+$/)
        .required()
        .messages({
            'string.base': 'Tên đăng nhập phải là chuỗi',
            'string.empty': 'Tên đăng nhập không được để trống',
            'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
            'string.max': 'Tên đăng nhập không được vượt quá 50 ký tự',
            'string.pattern.base': 'Tên đăng nhập chỉ được chứa chữ cái, số và gạch dưới'
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'vn'] } })
        .required()
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống'
        }),

    fullName: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Tên đầy đủ phải có ít nhất 2 ký tự',
            'string.max': 'Tên đầy đủ không được vượt quá 100 ký tự'
        }),
    avatar: Joi.string()
        .allow(null, '')
        .optional(),
    isActive: Joi.boolean()
        .default(true) // Default to true if not provided
        .messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        })
}).min(1).message('Cần ít nhất 1 trường để cập nhật');

// Schema cho các API khác
export const accountIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
});

