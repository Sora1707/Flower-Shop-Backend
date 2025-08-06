import { Document } from "mongoose";
import { IAddress } from "./address.interface";
import { IStripeCard } from "@/payment/stripe";
import { IStripeCardDocument } from "@/payment/stripe/StripeCard.interface";

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other",
}

export enum Role {
    User = "user",
    Admin = "admin",
    SuperAdmin = "superadmin",
}

export interface IUser {
    role: Role;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthdate: Date;
    gender: Gender;
    avatar?: {
        small: string;
        medium: string;
        large: string;
    } | null;
    addresses: IAddress[];

    stripeCustomerId: string;
    cards: IStripeCard[];

    createdAt: Date;
    updatedAt: Date;
    passwordChangedAt: Date;
}

export interface IUserDocument extends IUser, Document {
    matchPassword(inputPassword: string): Promise<boolean>;
}
