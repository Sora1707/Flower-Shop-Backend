import { Schema } from "mongoose";

import { ICartItem, ICartItemDocument } from "./cartItem.interface";

export const CartItemSchema = new Schema<ICartItemDocument>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        priceAtAddTime: { type: Number },
    },
    { timestamps: true }
);
