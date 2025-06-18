import { Document, Types } from "mongoose";

export interface IOrderItem extends Document {
    product: Types.ObjectId;
    quantity: number;
    priceAtAddTime: number;
    createdAt: Date;
    updatedAt: Date;
}
