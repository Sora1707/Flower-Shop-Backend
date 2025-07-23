import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Schema, PaginateModel } from "mongoose";

import { IProduct, Category } from "./product.interface";

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        dailyRuleId: { type: String, required: true, ref: "DailyRule"},
        promotionId: [{ type: String}],
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
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model<IProduct, PaginateModel<IProduct>>(
    "Product",
    ProductSchema
);
