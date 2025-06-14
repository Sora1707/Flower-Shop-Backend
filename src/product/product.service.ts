import { BasePaginateService } from "@/services/base.service";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";
import { FilterQuery } from "mongoose";

class ProductService extends BasePaginateService<IProduct> {
    protected model = ProductModel;

    async getProductsWithFilters(
        page: number = 1,
        limit: number = 10,
        filters: any = {},
        sort: any = { createdAt: -1 }  // Default: sort by latest products (descending order by createdAt)
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

        return await ProductModel.paginate(query, {
            page,
            limit,
            sort,
        });
    }

    // Method to search products with autocomplete
    async searchProducts(query: string) {
        return ProductModel.find({
            name: { $regex: query, $options: "i" },  // case-insensitive search
        }).limit(10); // Limit to 10 results
    }
}

const productService = new ProductService();
export default productService;
