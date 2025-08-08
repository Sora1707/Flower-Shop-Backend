import * as z from "zod";
import { Gender } from "@/user";

const strongPasswordType = z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

/* LOGIN */
export const loginValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export type LoginInput = z.infer<typeof loginValidation>;

/* REGISTER */
export const registerValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: strongPasswordType,
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }).optional(),
    birthdate: z.coerce.date(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
});
export type RegisterInput = z.infer<typeof registerValidation>;

/* REQUEST PASSWORD RESET */
export const requestPasswordResetValidation = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetValidation>;

/* RESET PASSWORD */
export const resetPasswordValidation = z.object({
    token: z.string().min(1, { message: "Token is required" }),
    newPassword: strongPasswordType,
});
export type ResetPasswordInput = z.infer<typeof resetPasswordValidation>;

/* PASSWORD CHANGE */
export const changePasswordValidaton = z.object({
    currentPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: strongPasswordType,
});

export type ChangePasswordInput = z.infer<typeof changePasswordValidaton>;
