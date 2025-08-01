import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { Gender, IUser, Role } from "./user.interface";

import * as password from "./password";
import { AddressSchema } from "./address.schema";
import { IAddress } from "./address.interface";

const MAX_ADDRESSES = 5;

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
                    validator: function (addresses: IAddress[]) {
                        const defaultCount = addresses.filter(a => a.isDefault).length;
                        return defaultCount <= 1;
                    },
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
        passwordChangedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

// model.save()
UserSchema.pre("save", async function (next) {
    try {
        if (this.isModified("addresses")) {
            let hasDefaultAddress = false;
            for (const address of this.addresses) {
                if (address.isDefault) {
                    hasDefaultAddress = true;
                    break;
                }
            }

            if (!hasDefaultAddress) {
                this.addresses[0].isDefault = true;
            }
        }
        if (this.isModified("password")) {
            this.password = await password.hash(this.password);
        }

        next();
    } catch (error) {
        next(error as any);
    }
});

UserSchema.methods.matchPassword = async function (inputPassword: string) {
    return await password.compare(inputPassword, this.password);
};

export const UserModel = mongoose.model<IUser, PaginateModel<IUser>>("User", UserSchema);
