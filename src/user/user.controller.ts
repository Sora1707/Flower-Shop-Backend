import { Request, Response, NextFunction } from "express";
import { UserModel } from "@/user/user.model"; //
import { userService } from "./user.service";
import crypto from "crypto"; //
import jwt from "jsonwebtoken"

class UserController {
    async reloadSampleData(req: Request, res: Response, next: NextFunction) {
        try {
            const users = require("@/data/users.json");
            await userService.deleteAll();
            const newUsers = await userService.createMany(users);
            res.status(200).json(newUsers);
        } catch (error) {
            next(error);
        }
    }

    // Get all users (for admin purposes)
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const user = await userService.findById(id);

            if(!user) {
                return res.status(404).json({message: "User not found."});
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const update = req.body;

            // Prevent update 'password'
            if ('password' in update) {
                delete update.password;
            }

            const updatedUser = await userService.updateById(id, update);

            if(!updatedUser) {
                return res.status(404).json({message: "User not found."});
            }
            res.status(200).json({ message: "User updated", user: updatedUser });
        }
        catch (error) {
            next(error);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deleteUser = await userService.deleteById(id);

            if(!deleteUser) {
                return res.status(404).json({message: "User not found."});
            }

            res.status(200).json({message: "User deleted successfully."});
        }
        catch (error) {
            next(error);
        }
    }

    // Register
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
                avatar
            } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            // Check if user exists
            const existingUser = await userService.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already registered" });
            }

            const newUser = new UserModel({
                email,
                password,
                username,
                firstName,
                lastName,
                phoneNumber,
                birthdate,
                gender,
                avatar
            });


            await newUser.save();

            res.status(201).json({
                message: "User registered successfully",
                user: newUser,
            });
        } catch (error) {
            next(error);
        }
    }

    // Login
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required" });
            }

            const user = await userService.findOne({ email });
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
                    email: user.email,
                    // role: user.role
                },
                process.env.JWT_SECRET || "your_jwt_secret",
                { expiresIn: "1h" }
            );

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    // role: user.role
                },
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
}

const userController = new UserController();
export default userController;
