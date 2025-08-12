import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Schema, PaginateModel } from "mongoose";

import { IProductDocument, ProductType } from "./product.interface";

const ProductSchema = new Schema<IProductDocument>(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ProductType, required: true },
        price: { type: Number, required: true },
        description: { type: String, default: "" },
        dailyRule: { type: Schema.Types.ObjectId, required: true, ref: "PriceRule" },
        promotions: {
            type: [Schema.Types.ObjectId],
            default: [],
            ref: "PriceRule",
        },
        images: { type: [String], default: [] },
        stock: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
    },
    { discriminatorKey: "type", timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = mongoose.model<IProductDocument, PaginateModel<IProductDocument>>(
    "Product",
    ProductSchema
);
