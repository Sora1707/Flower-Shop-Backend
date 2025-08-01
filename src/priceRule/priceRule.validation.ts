// import * as z from "zod";

// function validatePriceRuleInput(rule: Partial<IPriceRule>) {
//   if (rule.type === PriceRuleType.DailyDecrease) {
//     if (!rule.dailyDecreaseAmount) throw new Error("dailyDecreaseAmount is required for daily_decrease");
//     if (rule.promotionDiscount || rule.productIds || rule.categoryIds)
//       throw new Error("Promotion fields are not allowed in daily_decrease rules");
//   }

//   if (rule.type === PriceRuleType.Promotion) {
//     if (!rule.promotionDiscount) throw new Error("promotionDiscount is required for promotion");
//     if (rule.dailyDecreaseAmount)
//       throw new Error("dailyDecreaseAmount is not allowed in promotion rules");
//   }
// }
