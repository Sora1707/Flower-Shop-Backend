import { Document, Types } from "mongoose";

import { IOrderItem } from "./orderItem.interface";

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    DELIVERING = "delivering",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export type ContactInfo = {
    name: string;
    email: string;
    phone: string;
    address: string;
};

export interface IOrder extends Document {
    user: Types.ObjectId;
    items: IOrderItem[];
    status: OrderStatus;
    contactInfo: ContactInfo;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
