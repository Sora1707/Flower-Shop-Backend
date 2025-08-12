import { ProductType } from "@/product";
import * as z from "zod";

export const productCreateValidation = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    type: z.enum([ProductType.Flower, ProductType.Vase]),
    description: z.string().min(1, { message: "Product description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }),
    isAvailable: z.boolean(),
});

export type ProductCreateInput = z.infer<typeof productCreateValidation>;

export const productUpdateValidation = z.object({
    name: z.string().min(1, { message: "Product name is required" }).optional(),
    description: z.string().min(1, { message: "Product description is required" }).optional(),
    price: z.number().min(0, { message: "Price must be a positive number" }).optional(),
    stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }).optional(),
    isAvailable: z.boolean().optional(),
});

export type ProductUpdateInput = z.infer<typeof productUpdateValidation>;
