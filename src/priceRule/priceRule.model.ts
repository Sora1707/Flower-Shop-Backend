import mongoose, { Schema, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { IPriceRuleDocument, PriceRuleType } from "./priceRule.interface";

const PriceRuleSchema = new Schema<IPriceRuleDocument>(
    {
        name: { type: String },
        type: { type: String, enum: PriceRuleType, required: true },
        active: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
        discountAmount: { type: Number, required: true },
        occasion: { type: String },
    },
    { timestamps: true }
);

PriceRuleSchema.plugin(mongoosePaginate);

PriceRuleSchema.pre("save", async function (next) {
    try {
        if (this.type === PriceRuleType.Promotion) {
            if (!this.startDate || !this.endDate) {
                throw new Error("Promotion price rule must have start date and end date");
            }
        }
        next();
    } catch (error) {
        next(error as any);
    }
});

export const PriceRuleModel = mongoose.model<IPriceRuleDocument, PaginateModel<IPriceRuleDocument>>(
    "PriceRule",
    PriceRuleSchema
);
