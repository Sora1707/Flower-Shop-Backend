import { Request, Response, NextFunction } from "express";
import crypto from "crypto"; //
import jwt from "jsonwebtoken";

import { userService, UserModel } from "./";
import { AuthRequest } from "@/types/request";

// API root: /api/user

const TOKEN_EXPIRATION = "1h"; // 1 hours

class UserController {
    // [GET] /
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            // const users = await userService.findAll();
            const filter = {};
            const paginateOptions = {
                page: 1,
                limit: 10,
            };
            const paginateResult = await userService.paginate(filter, paginateOptions);
            // res.status(200).json(users);
            res.status(200).json(paginateResult);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /:id
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.findById(id);

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
            console.log(req.body);
            const { username, password } = req.body;

            console.log(username, password);

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
                user: {
                    id: user._id,
                },
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

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const existingUser = await userService.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
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

    // // Request Password Reset
    // async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { email } = req.body;

    //         if (!email) {
    //             return res.status(400).json({ message: "Email is required" });
    //         }

    //         const user = await UserModel.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({ message: "User not found" });
    //         }

    //         // Generate reset token
    //         const resetToken = crypto.randomBytes(32).toString("hex");
    //         user.resetPasswordToken = resetToken;
    //         user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    //         await user.save();

    //         // In a real app, send email with reset link (e.g., http://yourapp.com/reset?token=resetToken)
    //         // For now, return token in response for testing
    //         res.status(200).json({
    //             message: "Password reset requested. Check your email.",
    //             resetToken, // Remove in production; send via email instead
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    // // Reset Password
    // async resetPassword(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { token, newPassword } = req.body;

    //         if (!token || !newPassword) {
    //             return res.status(400).json({ message: "Token and new password are required" });
    //         }

    //         const user = await UserModel.findOne({
    //             resetPasswordToken: token,
    //             resetPasswordExpires: { $gt: new Date() },
    //         });

    //         if (!user) {
    //             return res.status(400).json({ message: "Invalid or expired token" });
    //         }

    //         // Update password (plain text for now)
    //         user.password = newPassword;
    //         user.resetPasswordToken = null;
    //         user.resetPasswordExpires = null;
    //         await user.save();

    //         res.status(200).json({ message: "Password reset successful" });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

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
}

const userController = new UserController();
export default userController;
