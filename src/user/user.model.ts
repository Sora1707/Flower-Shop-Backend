import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Document, Schema } from "mongoose";
import { PaginateModel } from "mongoose";

import { IUser, Gender } from "./user.interface";

import bcrypt from "bcryptjs";

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        birthdate: { type: Date, required: true },
        gender: { type: String, enum: Object.values(Gender) },
        avatar: { type: String },
    },
    { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export const UserModel = mongoose.model<IUser, PaginateModel<IUser>>("User", UserSchema);
