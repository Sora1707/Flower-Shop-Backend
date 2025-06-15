import mongoose, { Schema } from "mongoose";
import { OrderItemSchema } from "./orderItem.schema";
import { IOrder, OrderStatus, ContactInfo } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: {
            type: [OrderItemSchema],
            default: [],
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        contactInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        totalPrice: { type: Number, required: true },
    },
    { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
