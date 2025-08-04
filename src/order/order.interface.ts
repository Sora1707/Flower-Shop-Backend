import { Document, Types } from "mongoose";

import { IOrderItem } from "./orderItem.interface";
import { PaymentMethod, PaymentStatus } from "./payment.interface";

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    DELIVERING = "delivering",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export type ContactInfo = {
    name: string;
    phoneNumber: string;
    postalCode: string;
    address: string;
};

export interface IOrder extends Document {
    user: Types.ObjectId;
    items: IOrderItem[];
    status: OrderStatus;
    contactInfo: ContactInfo;
    paymentMethod: PaymentMethod;
    // paymentResult: {
    //     id: string;
    //     status: PaymentStatus;
    //     update_time: string;
    //     email_address: string;
    // };
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
