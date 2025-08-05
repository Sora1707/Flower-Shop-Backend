import { Document } from "mongoose";
import { IAddress } from "./address.interface";
import { IStripeCard } from "@/payment/stripe";

export enum Gender {
    Male = "male",
    Female = "female",
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
    matchPassword(inputPassword: string): Promise<boolean>;
}
