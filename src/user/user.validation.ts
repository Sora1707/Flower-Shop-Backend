import * as z from "zod";
import { Gender } from "./user.interface";

const passwordType = z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

export const UserLoginValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export type UserLoginInput = z.infer<typeof UserLoginValidation>;

export const UserRegisterValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: passwordType,
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    birthdate: z.coerce.date().optional(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other, Gender.Unknown]).optional(),
});
export type UserRegisterInput = z.infer<typeof UserRegisterValidation>;

export const UserAddressValidation = z.object({
    name: z.string().min(1, { message: "Full name is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    stateOrProvince: z.string().min(1, { message: "State or province is required" }),
    city: z.string().min(1, { message: "City is required" }),
    addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
    addressLine2: z.string().optional(),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    isDefault: z.boolean().default(false),
});

export type UserAddressInput = z.infer<typeof UserAddressValidation>;

export const UserPasswordChangeValidaton = z.object({
    currentPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: passwordType,
});

export type UserPasswordChangeInput = z.infer<typeof UserPasswordChangeValidaton>;

export const UserAddCardValidation = z.object({
    paymentMethodId: z.string().min(1, { message: "Payment method ID is required" }),
});

export type UserAddCardInput = z.infer<typeof UserAddCardValidation>;
