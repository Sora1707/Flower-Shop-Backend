import * as z from "zod";
import { PriceRuleType } from "./priceRule.interface";

export const PriceRuleCreateValidation = z.object({
    type: z.nativeEnum(PriceRuleType, {
        errorMap: () => ({ message: "Invalid price rule type" }),
    }),
    discountAmount: z
        .number({
        required_error: "Discount amount is required",
        invalid_type_error: "Discount amount must be a number",
        })
        .positive("Discount amount must be greater than 0"),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export type PriceRuleCreateInput = z.infer<typeof PriceRuleCreateValidation>;

export const PriceRuleUpdateValidation = z.object({
    type: z.nativeEnum(PriceRuleType).optional(),
    discountAmount: z
        .number()
        .positive("Discount amount must be greater than 0")
        .optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
});

export type PriceRuleUpdateInput = z.infer<typeof PriceRuleUpdateValidation>;
