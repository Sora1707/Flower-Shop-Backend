import express from 'express';
import UserController from "@/controllers/UserController"
import asyncHandler from '@/middleware/asyncHandler';

const router = express.Router();

router.post('/login', asyncHandler(UserController.login));
router.post('/register', asyncHandler(UserController.register));
router.post('/request-password-reset', asyncHandler(UserController.requestPasswordReset));
router.post('/reset-password', asyncHandler(UserController.resetPassword));

export default router;
