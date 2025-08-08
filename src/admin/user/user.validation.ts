import { Role } from "@/user";
import * as z from "zod";

export const adminUserUpdateRoleValidation = z.object({
    role: z.enum([Role.Admin, Role.User]),
});

export type AdminUserUpdateRoleValidation = z.infer<typeof adminUserUpdateRoleValidation>;
