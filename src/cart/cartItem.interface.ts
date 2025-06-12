import { Document, Types } from "mongoose";

export interface ICartItem extends Document {
    product: Types.ObjectId;
    quantity: number;
    priceAtAddTime: number;
    createdAt: Date;
    updatedAt: Date;
}
