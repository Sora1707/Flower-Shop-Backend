import * as z from "zod";

export const paginateOptionsOnRequestQuery = z.object({
    limit: z.string().optional(),
    page: z.string().optional(),
    sortBy: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
});

export type PaginateOptionsOnRequestQuery = z.infer<typeof paginateOptionsOnRequestQuery>;
