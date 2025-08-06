import { Document, Types } from "mongoose";

export interface ICartItem {
    product: Types.ObjectId;
    quantity: number;
    priceAtAddTime: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartItemDocument extends ICartItem, Document {}
