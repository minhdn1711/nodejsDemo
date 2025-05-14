import express from 'express';
const router = express.Router();
import upload from '../../../config/upload.js';
import { validate } from '../../../middlewares/validate.js';
import UploadController from '../controllers/upload.controller.js';
import { imageSchema } from '../validations/upload.validation.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

// Áp dụng middleware cho tất cả các route của product
router.use(authMiddleware);
router.post(
    '/',
    upload.single('image'), // Multer middleware
    validate(imageSchema),  // Joi validation
    UploadController.uploadImage
);

export default router;
