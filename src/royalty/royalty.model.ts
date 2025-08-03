import mongoose, { Schema } from "mongoose";
import { IRoyaltyPoint, RoyaltyPointAction } from "./royalty.interface";

const royaltyPointSchema = new Schema<IRoyaltyPoint>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        points: { type: Number, required: true },
        type: { type: String, enum: Object.values(RoyaltyPointAction), required: true },
        description: { type: String },
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const RoyaltyPointModel = mongoose.model("RoyaltyPoint", royaltyPointSchema);
