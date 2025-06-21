import { Schema } from "mongoose";

import { IOrderItem } from "./orderItem.interface";

export const OrderItemSchema = new Schema<IOrderItem>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        priceAtAddTime: { type: Number },
    },
    { timestamps: true }
);
