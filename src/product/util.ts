import { FilterQuery } from "mongoose";

import { IProduct } from "./model/product.interface";
import { ProductFilter, ProductRequestQuery } from "./product.validation";
import { getPaginateOptions } from "@/utils/mongoose";

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
