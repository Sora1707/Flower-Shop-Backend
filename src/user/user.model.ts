import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { Gender, IUserDocument, Role } from "./user.interface";

import * as password from "./password";
import { AddressSchema } from "./address.schema";
import { IAddress } from "./address.interface";
import { StripeCardSchema } from "@/payment/stripe";
import { getBeforeSavePropertyModifiers, getInitializers } from "./user.middelware";

const MAX_ADDRESSES = 5;
const MAX_CARDS = 5;

function validateOneDefaultValue<T extends { isDefault: boolean }>(elements: T[]) {
    const defaultCount = elements.filter((element) => element.isDefault).length;
    return defaultCount <= 1;
}

const UserSchema = new Schema<IUserDocument>(
    {
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.User,
        },
        username: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phoneNumber: { type: String },
        birthdate: { type: Date, required: true },
        gender: { type: String, enum: Object.values(Gender), required: true },
        avatar: {
            small: { type: String },
            medium: { type: String },
            large: { type: String },
        },
        addresses: {
            type: [AddressSchema],
            default: [],
            validate: [
                {
                    validator: validateOneDefaultValue,
                    message: "Only one address can be set as default.",
                },
                {
                    validator: function (addresses: IAddress[]) {
                        return addresses.length <= MAX_ADDRESSES;
                    },
                    message: `A user can have up to ${MAX_ADDRESSES} addresses only. Please remove an address to add a new one.`,
                },
            ],
        },
        stripeCustomerId: { type: String, immutable: true },
        cards: {
            type: [StripeCardSchema],
            default: [],
            validate: [
                {
                    validator: validateOneDefaultValue,
                    message: "Only one card can be set as default.",
                },
                {
                    validator: function (cards: any[]) {
                        return cards.length <= MAX_CARDS;
                    },
                    message: `A user can have up to ${MAX_CARDS} cards only. Please remove a card to add a new one.`,
                },
            ],
        },
        passwordChangedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

UserSchema.methods.matchPassword = async function (inputPassword: string) {
    return await password.compare(inputPassword, this.password);
};

UserSchema.pre("save", async function (next) {
    try {
        const handlers: Promise<void>[] = [];

        handlers.push(...getBeforeSavePropertyModifiers(this));

        if (this.isNew) {
            handlers.push(...getInitializers(this));
        }

        await Promise.all(handlers);

        next();
    } catch (error) {
        next(error as any);
    }
});

UserSchema.pre("findOneAndUpdate", async function (next) {
    console.log("findOneAndUpdate");
});

UserSchema.pre("updateOne", async function (next) {
    console.log("updateOne");
});

UserSchema.pre("updateMany", async function (next) {
    console.log("updateMany");
});

export const UserModel = mongoose.model<IUserDocument, PaginateModel<IUserDocument>>(
    "User",
    UserSchema
);
