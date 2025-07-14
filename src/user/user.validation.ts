import * as z from "zod";
import { Gender } from "./user.interface";

export const UserLoginValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export type UserLoginInput = z.infer<typeof UserLoginValidation>;

export const UserRegisterValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[a-z]/, "Password must contain a lowercase letter")
        .regex(/[A-Z]/, "Password must contain an uppercase letter")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    birthdate: z.coerce.date(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
});
export type UserRegisterInput = z.infer<typeof UserRegisterValidation>;
