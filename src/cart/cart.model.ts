import mongoose, { Schema } from "mongoose";
import { CartItemSchema } from "./cartItem.schema";
import { ICart } from "./cart.interface";

const CartSchema = new Schema<ICart>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: {
            type: [CartItemSchema],
            default: [],
        },
    },
    { timestamps: true }
);

export const CartModel = mongoose.model<ICart>("Cart", CartSchema);
