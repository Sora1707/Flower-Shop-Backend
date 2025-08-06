import { Document } from "mongoose";

export interface IStripeCard {
    paymentMethodId: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
    isDefault: boolean;
}

export interface IStripeCardDocument extends IStripeCard, Document {}
