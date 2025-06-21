import { Request, Response, NextFunction } from "express";

import crypto from "crypto"; //
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import bcrypt from "bcryptjs";

import { SelectedFieldsObject } from "@/services";
import { AuthRequest } from "@/types/request";
import mongoose from "mongoose";

import { IUser } from "./user.interface";
import userService from "./user.service";

// API root: /api/user

const TOKEN_EXPIRATION = "1h"; // 1 hours
const DEFAULT_SELECTED_FIELDS_OBJECT: SelectedFieldsObject<IUser> = {
    password: 0,
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
        return res.status(200).json(user?._id);
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
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
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

            const selectedFieldsObject: SelectedFieldsObject<IUser> = {
                ...DEFAULT_SELECTED_FIELDS_OBJECT,
            };

            const existingUser = await userService.findOne({ username }, selectedFieldsObject);
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

            res.status(201).json({
                message: "User registered successfully",
                user: newUser,
            });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /:id
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const update = req.body;

            // Prevent update 'password'
            if ("password" in update) {
                delete update.password;
            }

            const updatedUser = await userService.updateById(id, update);

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
            res.status(200).json({ message: "User updated", user: updatedUser });
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

    // POST /:id/request-password-reset
    async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: "User ID are required" });
            }

            const user = await userService.findById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const resetToken = crypto.randomBytes(20).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();

            const resetLink = `${process.env.FRONT_END_URL}/reset-password?token=${resetToken}`;
            await transporter.sendMail({
                to: user.email,
                subject: "Password Reset Request",
                html: `Click ${resetLink} to reset your password. This link expires in 1 hour.`,
            });

            res.status(200).json({
                message: "Password reset requested. Check your email.",
                // resetToken,
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

            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
            const user = await userService.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { $gt: new Date() },
            });

            if (!user) {
                return res.status(400).json({ message: "Invalid or expired token" });
            }

            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                user.password = await bcrypt.hash(newPassword, 10);
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save({ session });
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
                throw error;
            } finally {
                session.endSession();
            }

            res.status(200).json({ message: "Password reset successful" });
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController();
export default userController;
