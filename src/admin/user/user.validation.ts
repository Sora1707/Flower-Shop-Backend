import { Role } from "@/user";
import { paginateOptionsOnRequestQuery } from "@/validation/request-query/paginateOptions.validation";
import * as z from "zod";

export const adminUserUpdateRoleValidation = z.object({
    role: z.enum([Role.Admin, Role.User]),
});

export type AdminUserUpdateRoleValidation = z.infer<typeof adminUserUpdateRoleValidation>;

export const adminUserFilterValidation = z.object({
    username: z.string().optional(),
    role: z.enum([Role.SuperAdmin, Role.Admin, Role.User]).optional(),
});

export type AdminUserFilter = z.infer<typeof adminUserFilterValidation>;

export const adminUserRequestQuery = z.object({
    ...paginateOptionsOnRequestQuery.shape,
    ...adminUserFilterValidation.shape,
});

export type AdminUserRequestQuery = z.infer<typeof adminUserRequestQuery>;
