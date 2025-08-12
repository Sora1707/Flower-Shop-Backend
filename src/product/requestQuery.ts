import { Request } from "express";
import { FilterQuery, PaginateOptions } from "mongoose";

import { IProduct } from "./model/product.interface";
import { ProductFilter, ProductRequestQuery } from "./product.validation";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const fields = ["keyword", "type", "minPrice", "maxPrice"];
const paginateFields = ["page", "limit", "sortBy", "order"];

export function extractProductOptionsFromRequest(requestQuery: ProductRequestQuery) {
    const { keyword, type, minPrice, maxPrice, page, limit, sortBy, order } = requestQuery;

    const filters = {
        keyword,
        type,
        minPrice,
        maxPrice,
    };

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

export function getFilters(filterQueries: ProductFilter) {
    const { keyword, type, minPrice, maxPrice } = filterQueries;

    const filter: FilterQuery<IProduct> = {
        name: { $regex: keyword ? keyword : "", $options: "i" },
    };

    if (type) {
        filter.type = { $all: type };
    }

    if (minPrice || maxPrice) {
        const priceFilter = {} as any;
        if (minPrice) {
            priceFilter.$gte = Number(minPrice);
        }
        if (maxPrice) {
            priceFilter.$lte = Number(maxPrice);
        }
        filter.price = priceFilter;
    }

    return filter;
}

export function getPaginateOptions(paginateQueries: any) {
    const { page, limit, sortBy, order } = paginateQueries;

    const paginateOptions: PaginateOptions = {
        page: page ? Number(page) : DEFAULT_PAGE,
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        sort: {
            [sortBy]: order === "asc" ? 1 : -1,
        },
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
