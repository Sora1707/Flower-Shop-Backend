import * as z from "zod";

export const updateCartItemQuantityValidation = z.object({
    productId: z.string().min(1, { message: "Product ID is required" }),
    quantity: z
        .number()
        .int({ message: "Quantity must be an integer" })
        .refine((value) => value !== 0, { message: "Quantity value cannot be 0" }),
});
export type UpdateCartItemQuantityInput = z.infer<typeof updateCartItemQuantityValidation>;
