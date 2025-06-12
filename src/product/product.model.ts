import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Document, Schema } from "mongoose";
import { PaginateModel } from "mongoose";

import { IProduct, Category } from "./product.interface";
import { RatingSchema } from "./rating.schema";

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
        ratings: { type: [RatingSchema], default: [] },
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

ProductSchema.virtual("avg_rating").get(function () {
    if (!this.ratings || this.ratings.length === 0) return 0;
    const total_score = this.ratings.reduce((sum, product) => sum + product.score, 0);
    const avg_score = total_score / this.ratings.length;
    return avg_score;
});

export const ProductModel = mongoose.model<IProduct, PaginateModel<IProduct>>(
    "Product",
    ProductSchema
);
