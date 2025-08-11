import { BasePaginateService } from "@/services";
import { IPriceRuleDocument, PriceRuleType } from "./priceRule.interface";
import { PriceRuleModel } from "./priceRule.model";
import { Types } from "mongoose";

class PriceRuleService extends BasePaginateService<IPriceRuleDocument> {
    protected model = PriceRuleModel;

    public async applyRulesToProduct(product: {
        price: number;
        createdAt: Date;
        dailyRuleID: Types.ObjectId;
        promotionIds: Types.ObjectId[];
    }): Promise<number> {
        const now = new Date();
        let finalPrice = product.price;

        const dailyRule = await this.model.findOne({
            _id: product.dailyRuleID,
            type: PriceRuleType.DailyDecrease,
            active: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        });

        if (dailyRule && dailyRule.type === PriceRuleType.DailyDecrease) {
            const daysSinceAdded = Math.floor(
                (now.getTime() - product.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            );
            const dailyDecreaseAmount = (dailyRule as any).discountAmount || 0;
            // console.log("Daily Decrease Amount:", dailyDecreaseAmount);
            const totalDecrease = dailyDecreaseAmount * daysSinceAdded;
            finalPrice = Math.max(0, finalPrice - totalDecrease);
        }

        if (product.promotionIds && product.promotionIds.length > 0) {
            const promotions = await this.model.find({
                _id: { $in: product.promotionIds },
                type: PriceRuleType.Promotion,
                active: true,
                startDate: { $lte: now },
                endDate: { $gte: now },
            });

            for (const promo of promotions) {
                const discount = promo.discountAmount || 0;
                finalPrice *= 1 - discount / 100;
            }
        }

        return parseFloat(finalPrice.toFixed(2));
    }
}

const priceRuleService = new PriceRuleService();
export default priceRuleService;
