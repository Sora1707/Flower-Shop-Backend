import { Document } from "mongoose";

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "other",
}

export interface IUser extends Document {
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
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    matchPassword(inputPassword: string): Promise<boolean>;
}
