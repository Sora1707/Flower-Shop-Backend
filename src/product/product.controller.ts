import { Request, Response, NextFunction } from "express";

import productService from "./product.service";
import { extractProductOptionsFromRequest, getFilters } from "./requestQuery";
import priceRuleService from "@/priceRule/priceRule.service";

class ProductController {
    // [GET] /product/
    async getProducts(req: Request, res: Response, next: NextFunction) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req);

        const result = await productService.paginate(filters, paginateOptions);

        res.status(200).json(result);
    }

    // [GET] /product/:id
    async getProductById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const product = await productService.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        const assignedPrice = await priceRuleService.applyRulesToProduct({
            price: product.price,
            createdAt: product.createdAt,
            dailyRuleID: product.dailyRuleId,
            promotionId: product.promotionId,
        });
        res.status(200).json({ assignedPrice, product });
    }

    // [GET] /product/search
    async searchProducts(req: Request, res: Response, next: NextFunction) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req);

        const result = await productService.paginate(filters, paginateOptions);

        res.status(200).json(result);
    }

    // [GET] /product/autocomplete
    async autoCompleteSearchQuery(req: Request, res: Response, next: NextFunction) {
        const { query } = req.query;

        const filters = getFilters({ query });
        const paginateOptions = { page: 1, limit: 10 };

        const result = await productService.paginate(filters, paginateOptions);

        const productNames = [];
        for (const product of result.docs) {
            productNames.push(product.name);
        }

        res.status(200).json(productNames);
    }
}

const productController = new ProductController();
export default productController;
