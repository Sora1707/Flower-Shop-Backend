import mongoose, { Schema } from "mongoose";

import { CartItemSchema } from "./cartItem.schema";
import { ICart, ICartDocument } from "./cart.interface";

const CartSchema = new Schema<ICartDocument>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: {
            type: [CartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const CartModel = mongoose.model<ICartDocument>("Cart", CartSchema);
