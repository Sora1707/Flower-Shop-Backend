import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import stripeService from "@/payment/stripe/service";

import { Gender, IUser, Role } from "./user.interface";

import * as password from "./password";
import { AddressSchema } from "./address.schema";
import { IAddress } from "./address.interface";
import { StripeCardSchema } from "@/payment/stripe";
import { modifyPropertiesBeforeSave } from "./user.middelware";

const MAX_ADDRESSES = 5;
const MAX_CARDS = 5;

function validateOneDefaultValue<T extends { isDefault: boolean }>(elements: T[]) {
    const defaultCount = elements.filter((element) => element.isDefault).length;
    return defaultCount <= 1;
}

const UserSchema = new Schema<IUser>(
    {
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.User,
        },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phoneNumber: { type: String },
        birthdate: { type: Date },
        gender: { type: String, enum: Object.values(Gender), default: Gender.Unknown },
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
        await modifyPropertiesBeforeSave(this);

        if (this.isNew) {
            const customer = await stripeService.createNewCustomer(this);
            this.stripeCustomerId = customer.id;
        }
        next();
    } catch (error) {
        next(error as any);
    }
});

export const UserModel = mongoose.model<IUser, PaginateModel<IUser>>("User", UserSchema);
