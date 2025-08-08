import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { Schema, PaginateModel } from "mongoose";

import { IProduct, IProductDocument, ProductType } from "./product.interface";

const ProductSchema = new Schema<IProductDocument>(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ProductType, required: true },
        price: { type: Number, required: true },
        dailyRule: { type: Schema.Types.ObjectId, required: true, ref: "PriceRule" },
        promotions: [{ type: Schema.Types.ObjectId, ref: "PriceRule" }],
        description: { type: String, required: true },
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
