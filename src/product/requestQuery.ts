import { Request } from "express";
import { FilterQuery, PaginateOptions } from "mongoose";

import { IProduct } from "./product.interface";

export function extractProductOptionsFromRequest(req: Request) {
    const { query, category, isAvailable, minPrice, maxPrice, ...paginateQueries } = req.query;

    const filterQueries = {
        query,
        category,
        isAvailable,
        minPrice,
        maxPrice,
    };

    return {
        filters: getFilters(filterQueries),
        paginateOptions: getPaginateOptions(paginateQueries),
    };
}

export function getFilters(filterQueries: any) {
    const { query, category, isAvailable, minPrice, maxPrice } = filterQueries;

    const filter: FilterQuery<IProduct> = {
        name: { $regex: query ? query : "", $options: "i" },
    };

    if (category) {
        const categories = (category as string).split(",");
        filter.categories = { $all: categories };
    }

    if (isAvailable) {
        filter.isAvailable = Boolean(isAvailable);
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
    const { page, limit, ...sortOptions } = paginateQueries;

    const paginateOptions: PaginateOptions = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sort: modifySortOptions(sortOptions),
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
