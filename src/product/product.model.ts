import mongoose, { Document, Schema } from "mongoose";

import { IProduct, IRating, Category } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        categories: [
            {
                type: String,
                enum: Category,
                lowercase: true,
                trim: true,
            },
        ],
        images: { type: [String], default: [] },
        stock: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
        ratings: [
            {
                userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
                score: { type: Number, min: 1, max: 5, required: true },
                updatedAt: { type: Date, default: Date.now },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

ProductSchema.virtual("rating").get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const total_score = this.ratings.reduce((sum, product) => sum + product.score, 0);
    const avg_score = total_score / this.ratings.length;
    return avg_score;
});

export const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);
