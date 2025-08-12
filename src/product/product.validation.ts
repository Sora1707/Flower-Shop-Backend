import * as z from "zod";
import { ProductType } from "./model";
import { paginateOptionsOnRequestQuery } from "@/validation/request-query/paginateOptions.validation";

export const productFilterValidation = z.object({
    keyword: z.string().optional(),
    type: z.enum([ProductType.Flower, ProductType.Vase]).optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
});

export type ProductFilter = z.infer<typeof productFilterValidation>;

export const productRequestQuery = z.object({
    ...paginateOptionsOnRequestQuery.shape,
    ...productFilterValidation.shape,
});

export type ProductRequestQuery = z.infer<typeof productRequestQuery>;
