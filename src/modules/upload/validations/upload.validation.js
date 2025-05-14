import Joi from 'joi';
import { TYPE_UPLOAD } from '../../../utils/constants.js';

export const imageSchema = Joi.object({
    type: Joi.string()
        .valid(...TYPE_UPLOAD)
        .required()
        .messages({
            'any.only': `Type must be one of: ${TYPE_UPLOAD.join(', ')}`,
            'any.required': 'Type is required'
        })
}).unknown(true); // Cho phép các field khác

