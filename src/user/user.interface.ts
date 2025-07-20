import { Document } from "mongoose";

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "other",
}

export enum Role {
    User = "user",
    Admin = "admin",
}

export interface IUser extends Document {
    role: Role;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthdate: Date;
    gender?: Gender;
    avatar?: {
        small: string;
        medium: string;
        large: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
    passwordChangedAt: Date;
    matchPassword(inputPassword: string): Promise<boolean>;
}
