const express = require('express');
const router = express.Router();
const userController = require('./controller.user');
const validate = require('../../middleware/middleware.validation');
const authMiddleware = require('../../middleware/authHelper');
const { 
  registerSchema, 
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../../validations/validation.user');

// Public routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// NEW: Forgot & Reset Password routes
router.post('/forgot-password', validate(forgotPasswordSchema), userController.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), userController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validate(updateProfileSchema), userController.updateProfile);
router.put('/change-password', authMiddleware, validate(changePasswordSchema), userController.changePassword);

module.exports = router;