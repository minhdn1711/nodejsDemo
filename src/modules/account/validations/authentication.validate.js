import Joi from 'joi';
import { Types } from 'mongoose';
import accountModel from '../models/account.model.js';


// Validation schema cho đăng nhập
export const loginSchema = Joi.object({
    // email: Joi.string()
    //     .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'vn'] } })
    //     .required()
    //     .messages({
    //         'string.email': 'Email không hợp lệ',
    //         'string.empty': 'Email không được để trống'
    //     }),

    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
            'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
            'string.empty': 'Tên đăng nhập không được để trống'
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
            'string.empty': 'Mật khẩu không được để trống'
        })
});

// Validation schema cho quên mật khẩu
export const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'vn'] } })
        .required()
        .external(async (value) => {
            // Kiểm tra email tồn tại trong CSDL
            const user = await accountModel.findOne({ email: value });

            if (!user) {
                throw new Error('Email không tồn tại trong hệ thống');
            }

            return value;
        })
        .messages({
            'string.email': 'Email không hợp lệ',
            'string.empty': 'Email không được để trống',
            'any.external': 'Email không tồn tại trong hệ thống'
        })
});

// Validation schema cho reset mật khẩu
export const resetPasswordSchema = Joi.object({
    token: Joi.string()
        .required()
        .messages({
            'string.empty': 'Token không được để trống'
        }),

    newPassword: Joi.string()
        .min(6)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
            'string.pattern.base': 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
        }),

    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Mật khẩu xác nhận không khớp'
        })
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            'any.required': 'Mật khẩu hiện tại không được để trống',
            'string.empty': 'Mật khẩu hiện tại không được để trống'
        }),

    newPassword: Joi.string()
        .min(6)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
        .required()
        .messages({
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.max': 'Mật khẩu không được vượt quá 30 ký tự',
            'string.pattern.base': 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
            'any.required': 'Mật khẩu mới không được để trống'
        }),

    confirmNewPassword: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Mật khẩu xác nhận không khớp',
            'any.required': 'Vui lòng xác nhận mật khẩu mới'
        })
});