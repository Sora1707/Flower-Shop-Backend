import { Request, Response, NextFunction } from "express";

import { getSafeUser, userService } from "@/user";

import authService from "./auth.service";

import {
    LoginInput,
    RegisterInput,
    ChangePasswordInput,
    RequestPasswordResetInput,
    loginValidation,
} from "./auth.validation";

import { sendResetPasswordEmail } from "@/utils/mailer";
import ResponseHandler from "@/utils/ResponseHandler";
import { FRONT_END_URL } from "@/config/dotenv";
import { AuthRequest } from "@/types/request";

class AuthController {
    // [POST] /auth/login
    async login(req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            const user = await userService.findOne({ username });
            if (!user) {
                return ResponseHandler.error(res, "This user does not exist", 404);
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return ResponseHandler.error(res, "Wrong password", 400);
            }

            const token = authService.generateLoginToken(user.id);

            ResponseHandler.success(
                res,
                { token, user: { id: user.id, username: user.username } },
                "Successfully logged in"
            );
        } catch (error) {
            next(error);
        }
    }

    // [POST] /auth/register
    async register(req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) {
        try {
            const newUserData = req.body;

            const existingUser = await userService.findOne({ username: newUserData.username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already registered" });
            }

            const newUser = await userService.create(newUserData);

            const safeUser = getSafeUser(newUser);

            ResponseHandler.success(res, safeUser, "User registered successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    // POST /request-password-reset
    async requestPasswordReset(
        req: Request<{}, {}, RequestPasswordResetInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email } = req.body;

            const user = await userService.findOne({ email });
            if (!user) {
                return ResponseHandler.error(res, "This email has not been registered", 404);
            }

            const resetToken = authService.generatePasswordResetToken(user.id);

            const resetLink = `${FRONT_END_URL}/reset-password?token=${resetToken}`;

            ResponseHandler.success(res, resetLink);

            // TODO: Add email service later on
            // await sendResetPasswordEmail(email, resetLink);

            // ResponseHandler.success(
            //     res,
            //     null,
            //     "Password reset requested. Please check your email."
            // );
        } catch (error) {
            next(error);
        }
    }

    // POST user/reset-password
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;

            let payload;
            try {
                payload = authService.getPasswordResetPayload(token);
            } catch (err) {
                return ResponseHandler.error(res, "Invalid or expired token", 400);
            }

            const { userId } = payload;
            const user = await userService.findById(userId);
            if (!user) {
                return ResponseHandler.error(res, "User not found", 404);
            }
            if (authService.checkPayloadBeforePasswordReset(payload, user)) {
                return ResponseHandler.error(
                    res,
                    "Token is outdated due to recent password change",
                    400
                );
            }

            user.password = newPassword;
            user.passwordChangedAt = new Date();
            await user.save();

            ResponseHandler.success(res, null, "Password reset successfully");
        } catch (error) {
            next(error);
        }
    }

    // [POST] user/change-password
    async changePassword(
        req: AuthRequest<{}, {}, ChangePasswordInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.user) {
                return;
            }

            const user = req.user;
            const { currentPassword, newPassword } = req.body;

            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                ResponseHandler.error(res, "Wrong password", 400);
            }

            user.password = newPassword;
            user.passwordChangedAt = new Date();
            await user.save();

            ResponseHandler.success(res, null, "Password changed successfully");
        } catch (err) {
            next(err);
        }
    }
}

const authController = new AuthController();
export default authController;
