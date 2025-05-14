import express from 'express';
const router = express.Router();
import AuthenticationController from '../controllers/authentication.controller.js';
import { validate } from '../../../middlewares/validate.js';
import { loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema } from '../../account/validations/authentication.validate.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.post('/login', validate(loginSchema, { location: 'body' }), AuthenticationController.login);
router.post('/forgot-password', validate(forgotPasswordSchema, { location: 'body' }), AuthenticationController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema, { location: 'body' }), AuthenticationController.resetPassword);
router.post('/change-password', authMiddleware, validate(changePasswordSchema, { location: 'body' }), AuthenticationController.changePassword);

export default router;