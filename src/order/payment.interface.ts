import { Schema, Types, model, Document } from "mongoose";

export enum PaymentMethod {
    Cash = "cash",
    Stripe = "stripe",
}

export enum PaymentStatus {
    Pending = "pending",
    Success = "success",
    Failed = "failed",
}

export interface IPayment extends Document {
    user: Types.ObjectId;
    method: PaymentMethod;
    status: PaymentStatus;
    stripePaymentMethodId?: string;
    createdAt: Date;
    updatedAt: Date;
}
