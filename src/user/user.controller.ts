import { Request, Response, NextFunction } from "express";

import crypto from "crypto"; //
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import { SelectedFieldsObject } from "@/services";
import { AuthRequest } from "@/types/request";
import mongoose from "mongoose";

import { IUser } from "./user.interface";
import userService from "./user.service";
import { cartService } from "@/cart";

// API root: /api/user

const TOKEN_EXPIRATION = "1h"; // 1 hours

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
    // [GET] /
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

            res.status(200).json(paginateResult);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /:id
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

            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        const user = req.user;
        return res.status(200).json(user);
    }

    // [POST] /login
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const user = await userService.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid username or password" });
            }

            // Generate JWT token (using a placeholder secret for now)
            const token = jwt.sign(
                {
                    userId: user._id,
                },
                process.env.JWT_SECRET as string,
                { expiresIn: TOKEN_EXPIRATION }
            );

            res.status(200).json({
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    // [POST] /register
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

            if (!username || !password) {
                return res.status(400).json({ message: "Username and password are required" });
            }

            const existingUser = await userService.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "Username already registered" });
            }

            if (!firstName || !lastName) {
                return res.status(400).json({ message: "First name and last name are required" });
            }

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            if (!phoneNumber) {
                return res.status(400).json({ message: "Phone number is required" });
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

            await cartService.create({ user: newUser.id });

            const { password: _pw, role, ...safeUser } = newUser.toObject();

            res.status(201).json({
                message: "User registered successfully",
                user: safeUser,
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /:id
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

            res.status(200).json({ message: "User updated", user: safeUser });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /:id
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleteUser = await userService.deleteById(id);

            if (!deleteUser) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({ message: "User deleted successfully." });
        } catch (error) {
            next(error);
        }
    }

    // POST /request-password-reset
    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const user = await userService.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_PASSWORD_SECRET!, {
                expiresIn: "1h",
            });

            const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}`;
            await transporter.sendMail({
                to: email,
                subject: "Password Reset Request",
                html: `Click <a href="${resetLink}">${resetLink}</a> to reset your password. This link expires in 1 hour.`,
            });

            res.status(200).json({
                message: "Password reset requested. Check your email.",
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /reset-password
    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                return res.status(400).json({ message: "Token and new password are required" });
            }

            let payload;
            try {
                payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!);
            } catch (err) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            const { userId } = payload as { userId: string };
            const user = await userService.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /change-password
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

            res.status(200).json({ message: "Password changed successfully" });
        } catch (err) {
            next(err);
        }
    }
}

const userController = new UserController();
export default userController;
