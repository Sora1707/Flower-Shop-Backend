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
    // role: Role;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    birthdate: Date;
    gender?: Gender;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    matchPassword(inputPassword: string): Promise<boolean>;
}
