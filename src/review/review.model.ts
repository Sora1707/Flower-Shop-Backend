import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Schema, PaginateModel } from "mongoose";

import { IReview } from "./review.interface";

const ReviewSchema = new Schema<IReview>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

ReviewSchema.plugin(mongoosePaginate);

export const ReviewModel = mongoose.model<IReview, PaginateModel<IReview>>("Review", ReviewSchema);
