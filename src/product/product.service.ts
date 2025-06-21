import { FilterQuery } from "mongoose";

import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

import { BasePaginateService } from "@/services";

class ProductService extends BasePaginateService<IProduct> {
    protected model = ProductModel;

    async getProductsWithFilters(
        page: number = 1,
        limit: number = 10,
        filters: any = {},
        sort: any = { createdAt: -1 } // Default: sort by latest products (descending order by createdAt)
    ) {
        const query: FilterQuery<IProduct> = {};

        if (filters.category) {
            query.categories = { $in: filters.category };
        }
        if (filters.isAvailable !== undefined) {
            query.isAvailable = filters.isAvailable;
        }
        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
        }

        return await this.model.paginate(query, {
            page,
            limit,
            sort,
        });
    }

    // Method to search products with autocomplete
    async searchProducts(query: string, limit: number = 10) {
        return this.model
            .find({
                name: { $regex: query, $options: "i" }, // case-insensitive search
            })
            .limit(limit); // Limit to 10 results
    }
}

const productService = new ProductService();
export default productService;
