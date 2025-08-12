import { Request, Response, NextFunction } from "express";

import productService from "./product.service";
import { extractProductOptionsFromRequest, getFilters } from "./requestQuery";
import priceRuleService from "@/priceRule/priceRule.service";
import ResponseHandler from "@/utils/ResponseHandler";
import { ProductType } from "./model";
import { ProductRequestQuery } from "./product.validation";

// TODO: Handle filters and pagination options
class ProductController {
    // [GET] /product/
    async getProducts(
        req: Request<{}, {}, {}, ProductRequestQuery>,
        res: Response,
        next: NextFunction
    ) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req.query);

        const paginateResult = await productService.paginate(filters, paginateOptions);

        ResponseHandler.success(res, paginateResult);
        return;
    }

    // [GET] /product/flower
    async getFlowers(req: Request, res: Response, next: NextFunction) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req.query);

        const paginateResult = await productService.paginate(
            {
                ...filters,
                type: ProductType.Flower,
            },
            paginateOptions
        );

        ResponseHandler.success(res, paginateResult);
    }

    // [GET] /product/vase
    async getVases(req: Request, res: Response, next: NextFunction) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req.query);

        const paginateResult = await productService.paginate(
            {
                ...filters,
                type: ProductType.Vase,
            },
            paginateOptions
        );

        ResponseHandler.success(res, paginateResult);
    }

    // [GET] /product/:productId
    async getProductById(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.productId;
        const product = await productService.findById(productId);

        if (!product) return ResponseHandler.error(res, "Product not found.", 404);

        const assignedPrice = await priceRuleService.applyRulesToProduct({
            price: product.price,
            createdAt: product.createdAt,
            dailyRuleID: product.dailyRule,
            promotionIds: product.promotions,
        });

        const returnProduct = {
            ...product.toObject(),
            price: assignedPrice,
            originalPrice: product.price,
        };

        ResponseHandler.success(res, returnProduct);
    }

    // [GET] /product/search
    async searchProducts(
        req: Request<{}, {}, {}, ProductRequestQuery>,
        res: Response,
        next: NextFunction
    ) {
        const { filters, paginateOptions } = extractProductOptionsFromRequest(req.query);

        const result = await productService.paginate(filters, paginateOptions);

        ResponseHandler.success(res, result);
    }

    // [GET] /product/autocomplete
    async autoCompleteSearchQuery(
        req: Request<{}, {}, {}, ProductRequestQuery>,
        res: Response,
        next: NextFunction
    ) {
        const { keyword } = req.query;

        const filters = getFilters({ keyword });
        const paginateOptions = { page: 1, limit: 10 };

        const result = await productService.paginate(filters, paginateOptions);

        console.log(result.docs);

        const productNames = [];
        for (const product of result.docs) {
            productNames.push(product.name);
        }

        ResponseHandler.success(res, productNames);
    }
}

const productController = new ProductController();
export default productController;
