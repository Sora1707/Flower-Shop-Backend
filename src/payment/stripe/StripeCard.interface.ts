import { Document } from "mongoose";

export interface IStripeCard extends Document {
    paymentMethodId: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
    isDefault: boolean;
}
