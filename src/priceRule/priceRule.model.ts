import mongoose, { Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IPriceRule, PriceRuleType } from "./priceRule.interface";

const PriceRuleSchema = new Schema<IPriceRule>(
    {
        name: { type: String },
        type: { type: String, enum: PriceRuleType, required: true },
        active: { type: Boolean, default: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        discountAmount: { type: Number, required: true }, 
        occasion: { type: String }, 
    },
    { timestamps: true }
);

PriceRuleSchema.plugin(mongoosePaginate);

export const PriceRuleModel = mongoose.model<IPriceRule, PaginateModel<IPriceRule>>(
    "PriceRule",
    PriceRuleSchema
);