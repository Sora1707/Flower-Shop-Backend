import * as z from "zod";
import { Gender } from "./user.interface";

export const UserLoginValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(1, { message: "Password is required" }),
});
export type UserLoginInput = z.infer<typeof UserLoginValidation>;

export const UserRegisterValidation = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    password: z.string().min(1, { message: "Password is required" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    birthdate: z.date(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
});
export type UserRegisterInput = z.infer<typeof UserRegisterValidation>;
