import { Schema } from "mongoose";
import { IAddress } from "./address.interface";

export const AddressSchema = new Schema<IAddress>(
    {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        country: { type: String, required: true },
        stateOrProvince: { type: String, required: true },
        city: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        postalCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);
