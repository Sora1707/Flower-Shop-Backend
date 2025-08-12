import { PaginateOptions } from "mongoose";

import { PaginateOptionsOnRequestQuery } from "@/validation/request-query/paginateOptions.validation";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function getPaginateOptions(paginateQueries: PaginateOptionsOnRequestQuery) {
    const { page, limit, sortBy, order } = paginateQueries;

    const paginateOptions: PaginateOptions = {
        page: page ? Number(page) : DEFAULT_PAGE,
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        sort: sortBy ? { [sortBy]: order === "asc" ? 1 : -1 } : {},
    };

    return paginateOptions;
}

export function modifySortOptions(sortOptions: any) {
    const sort: any = {};
    for (const [key, value] of Object.entries(sortOptions)) {
        if (value !== "asc" && value !== "desc") continue;
        sort[key] = value === "asc" ? 1 : -1;
    }
    if (Object.keys(sort).length === 0) sort.createdAt = -1;

    return sort;
}
