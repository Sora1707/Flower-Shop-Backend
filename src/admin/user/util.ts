import { getPaginateOptions } from "@/utils/mongoose";
import { AdminUserFilter, AdminUserRequestQuery } from "./user.validation";
import { FilterQuery } from "mongoose";
import { IUser } from "@/user";

export function extractUserOptionsFromRequest(requestQuery: AdminUserRequestQuery) {
    const { page, limit, sortBy, order, ...filters } = requestQuery;

    const paginateOptions = {
        page,
        limit,
        sortBy,
        order,
    };

    return {
        filters: getFilters(filters),
        paginateOptions: getPaginateOptions(paginateOptions),
    };
}

export function getFilters(filterQueries: AdminUserFilter) {
    const { username, role } = filterQueries;

    const filter: FilterQuery<IUser> = {};

    if (username) filter.username = username;
    if (role) filter.role = role;

    return filter;
}
