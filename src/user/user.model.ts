import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Document, Schema } from "mongoose";
import { PaginateModel } from "mongoose";

import { IUser, Gender } from "./user.interface";

import * as password from "./password";

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
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);

// model.save()
UserSchema.pre("save", async function (next) {
    try {
        // If the password is not modified, skip hashing
        if (!this.isModified("password")) return next();

        // Hash the password
        this.password = await password.hash(this.password);
        next();
    } catch (error) {
        next(error as any);
    }
});

// model.create() and model.insertMany()
UserSchema.pre("insertMany", async function (next, docs: IUser[]) {
    Promise.all(
        docs.map(async doc => {
            doc.password = await password.hash(doc.password);
        })
    )
        .then(() => next())
        .catch(next);
});

UserSchema.methods.matchPassword = async function (inputPassword: string) {
    return await password.compare(inputPassword, this.password);
};

export const UserModel = mongoose.model<IUser, PaginateModel<IUser>>("User", UserSchema);
