import { Schema } from "mongoose";
import { IStripeCard, IStripeCardDocument } from "./StripeCard.interface";

export const StripeCardSchema = new Schema<IStripeCardDocument>(
    {
        paymentMethodId: { type: String, required: true, immutable: true },
        brand: { type: String, required: true, immutable: true },
        exp_month: { type: Number, required: true, immutable: true },
        exp_year: { type: Number, required: true, immutable: true },
        last4: { type: String, required: true, immutable: true },
        isDefault: { type: Boolean, default: false },
    },
    { timestamps: true }
);
