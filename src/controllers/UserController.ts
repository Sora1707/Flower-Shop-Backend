import { Request, Response, NextFunction } from 'express';
import User from '@/models/user'
import crypto from 'crypto'; // For generating reset tokens

class UserController {
    // Register
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const user = new User[{
            email,
            password,
            role: "RegisteredBuyer" 
        }];

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user._id, email: user.email, role: user.role },
        });
        } catch (error) {
        next(error);
        }
    }

    // Login
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token (using a placeholder secret for now)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, role: user.role },
        });
        } catch (error) {
        next(error);
        }
    }

    // Request Password Reset
    static async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
        await user.save();

        // In a real app, send email with reset link (e.g., http://yourapp.com/reset?token=resetToken)
        // For now, return token in response for testing
        res.status(200).json({
            message: 'Password reset requested. Check your email.',
            resetToken, // Remove in production; send via email instead
        });
        } catch (error) {
        next(error);
        }
    }

    // Reset Password
    static async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Update password (plain text for now)
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
        next(error);
        }
    }
}

export default UserController;