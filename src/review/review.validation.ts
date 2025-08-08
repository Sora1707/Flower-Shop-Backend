import * as z from "zod";
import Filter from "bad-words";

const filter = new Filter();

export const reviewValidation = z.object({
    userId: z.string().uuid({ message: "Invalid user ID" }),
    productId: z.string().uuid({ message: "Invalid product ID" }),
    rating: z
        .number()
        .int()
        .min(1)
        .max(5)
        .refine((val) => val >= 1 && val <= 5, {
            message: "Rating must be between 1 and 5",
        }),
    comment: z
        .string()
        .min(10, { message: "Review must be at least 10 characters long" })
        .max(1000, { message: "Review is too long" })
        .refine((val) => !filter.isProfane(val), {
            message: "Comment contains inappropriate language",
        }),
});

export type ReviewInput = z.infer<typeof reviewValidation>;
