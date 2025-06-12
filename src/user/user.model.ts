import mongoose, { Document, Schema } from "mongoose";

import { IUser, Gender } from "./user.interface";

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

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const encryptedPassword = this.password;
    this.password = encryptedPassword;
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
    return true;
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
