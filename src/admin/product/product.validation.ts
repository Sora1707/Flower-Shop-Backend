import * as z from "zod";

export const productCreateValidation = z.object({
    name: z.string().min(1, { message: "Product name is required" }),
    description: z.string().min(1, { message: "Product description is required" }),
    price: z.number().min(0, { message: "Price must be a positive number" }),
    category: z.string().min(1, { message: "Category is required" }),
    stock: z.number().int().min(0, { message: "Stock must be a non-negative integer" }),
    imageUrl: z.string().url({ message: "Image URL must be a valid URL" }).optional(),
});

export type ProductCreateInput = z.infer<typeof productCreateValidation>;
