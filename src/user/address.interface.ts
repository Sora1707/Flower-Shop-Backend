import { Document } from "mongoose";

export interface IAddress extends Document {
    name: string;
    phoneNumber: string;
    country: string;
    stateOrProvince: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    isDefault: boolean;
}
