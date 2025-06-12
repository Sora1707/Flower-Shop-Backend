import { Schema } from "mongoose";
import { IRating } from "./rating.interface";

export const RatingSchema = new Schema<IRating>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        score: { type: Number, min: 1, max: 5, required: true },
    },
    {
        timestamps: true,
    }
);
