import * as z from "zod";

export const UserLoginValidation = z.object({
    username: z.string().min(3),
    password: z.string(),
});
export type UserLoginInput = z.infer<typeof UserLoginValidation>;
