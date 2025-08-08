import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Schema, PaginateModel } from "mongoose";

import { IReview, IReviewDocument } from "./review.interface";

const ReviewSchema = new Schema<IReviewDocument>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.plugin(mongoosePaginate);

export const ReviewModel = mongoose.model<IReviewDocument, PaginateModel<IReviewDocument>>(
    "Review",
    ReviewSchema
);
