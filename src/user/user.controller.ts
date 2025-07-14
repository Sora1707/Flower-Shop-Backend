import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import { SelectedFieldsObject } from "@/services";
import { AuthRequest } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";

import { cartService, ICartItem } from "@/cart";
import {
    generateLoginToken,
    generatePasswordResetToken,
    getPasswordResetPayload,
} from "@/utils/token";
import { IUser } from "./user.interface";
import userService from "./user.service";
import { UserLoginInput } from "./user.validation";

const DEFAULT_SELECTED_FIELDS_OBJECT: SelectedFieldsObject<IUser> = {
    password: 0,
    role: 0,
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

class UserController {
    // [GET] /user/
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { page, limit } = req.query;

            const filter = {};

            const selectedFieldsObject: SelectedFieldsObject<IUser> = {
                ...DEFAULT_SELECTED_FIELDS_OBJECT,
            };

            const paginateOptions = {
                page: page ? parseInt(page as string, 10) : 1,
                limit: limit ? parseInt(limit as string, 10) : 10,
                select: selectedFieldsObject,
            };

            const paginateResult = await userService.paginate(filter, paginateOptions);

            ResponseHandler.success(res, paginateResult);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/:id
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const selectedFieldsObject: SelectedFieldsObject<IUser> = {
                ...DEFAULT_SELECTED_FIELDS_OBJECT,
            };

            const user = await userService.findById(id, selectedFieldsObject);

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            ResponseHandler.success(res, user);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/me
    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        const user = req.user;
        return res.status(200).json(user);
    }

    // [POST] /user/login
    async login(req: Request<{}, {}, UserLoginInput>, res: Response, next: NextFunction) {
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

            const token = generateLoginToken(user.id);

            ResponseHandler.success(
                res,
                { token, user: { id: user.id, username: user.username } },
                "Successfully logged in"
            );
        } catch (error) {
            next(error);
        }
    }

    // [POST] /user/register
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                email,
                password,
                username,
                firstName,
                lastName,
                phoneNumber,
                birthdate,
                gender,
                avatar,
            } = req.body;

            console.log(req.body);

            const existingUser = await userService.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already registered" });
            }

            const newUserData = {
                email,
                password,
                username,
                firstName,
                lastName,
                phoneNumber,
                birthdate,
                gender,
                avatar,
            };

            const newUser = await userService.create(newUserData);

            await cartService.create({
                user: new mongoose.Types.ObjectId(newUser._id as string),
                items: [] as ICartItem[],
            });

            await cartService.create({ user: newUser.id });

            const { password: _pw, role, ...safeUser } = newUser.toObject();

            ResponseHandler.success(res, { user: safeUser }, "User registered successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /user/:id
    async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const updatedUserData = req.body;

            delete updatedUserData.password;
            delete updatedUserData.role;

            const updatedUser = await userService.updateById(req.user.id, updatedUserData);

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }

            const { password: _pw, role, ...safeUser } = updatedUser.toObject();

            ResponseHandler.success(res, { user: safeUser }, "User updated successfully");
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /user/:id
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleteUser = await userService.deleteById(id);

            if (!deleteUser) {
                return res.status(404).json({ message: "User not found." });
            }

            ResponseHandler.success(res, null, "User deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /me
    async deleteCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const id = req.user?._id;
            const deleteUser = await userService.deleteById(id as string);

            if (!deleteUser) {
                return res.status(404).json({ message: "User not found." });
            }

            ResponseHandler.success(res, null, "User deleted successfully");
        } catch (error) {
            next(error);
        }
    }

    // POST /request-password-reset
    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            if (!email) {
                return ResponseHandler.error(res, "Email is required", 400);
            }

            const user = await userService.findOne({ email });
            if (!user) {
                return ResponseHandler.error(res, "User not found", 404);
            }

            const resetToken = generatePasswordResetToken(user.id);

            const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}`;
            await transporter.sendMail({
                to: email,
                subject: "Password Reset Request",
                html: `Click <a href="${resetLink}">${resetLink}</a> to reset your password. This link expires in 1 hour.`,
            });

            ResponseHandler.success(res, null, "Password reset requested. Check your email.");
        } catch (error) {
            next(error);
        }
    }

    // POST user/reset-password
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return ResponseHandler.error(res, "Token and new password are required", 400);
            }

            let payload;
            try {
                payload = getPasswordResetPayload(token);
            } catch (err) {
                return ResponseHandler.error(res, "Invalid or expired token", 400);
            }

            const { userId } = payload;
            const user = await userService.findById(userId);
            if (!user) {
                return ResponseHandler.error(res, "User not found", 404);
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            ResponseHandler.success(res, null, "Password reset successful");
        } catch (error) {
            next(error);
        }
    }

    // [PUT] user/change-password
    async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = req.user;

            if (!currentPassword || !newPassword) {
                return res
                    .status(400)
                    .json({ message: "Current password and new password are required" });
            }

            if (!user) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            ResponseHandler.success(res, null, "Password changed successfully");
        } catch (err) {
            next(err);
        }
    }
}

const userController = new UserController();
export default userController;
