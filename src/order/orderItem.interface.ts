import { Document, Types } from "mongoose";

export interface IOrderItem {
    product: Types.ObjectId;
    quantity: number;
    priceAtAddTime: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItemDocument extends IOrderItem, Document {}
