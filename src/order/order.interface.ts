import { Document, Types } from "mongoose";

import { IOrderItem } from "./orderItem.interface";
import { PaymentMethod, PaymentStatus } from "@/payment/payment.interface";

export enum OrderStatus {
    Pending = "pending",
    Processing = "processing",
    Delivering = "delivering",
    Completed = "completed",
    Cancelled = "cancelled",
    Failed = "failed",
    Refunded = "refunded",
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
    contactInfo: ContactInfo;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod: PaymentMethod;
    paymentMethodId?: string;
    paymentIntentId?: string;
    orderFailureReason?: string;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt: Date;
    isDelivered: boolean;
    deliveredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
