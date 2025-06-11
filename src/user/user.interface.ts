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
    matchPassword(enteredPassword: string): Promise<boolean>;
}
