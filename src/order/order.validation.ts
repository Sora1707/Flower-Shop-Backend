import * as z from "zod";

export const OrderCreateValidation = z.object({
     selectedItems: z.array(z.string()).min(1, { message: "At least one item must be selected." }),
  address: z.string().min(1, { message: "Address is required." }),
})

export type OrderCreateInput = z.infer<typeof OrderCreateValidation>;