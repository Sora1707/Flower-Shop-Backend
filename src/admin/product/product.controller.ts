import { NextFunction, Request, Response } from "express";

import { productService } from "@/product";

import ResponseHandler from "@/utils/ResponseHandler";
import { ProductCreateInput, ProductUpdateInput } from "./product.validation";

// TODO add images

class AdminProductController {
    // [POST] /admin/product
    async createProduct(
        req: Request<{}, {}, ProductCreateInput>,
        res: Response,
        next: NextFunction
    ) {
        const newProduct = await productService.create(req.body);

        ResponseHandler.success(res, newProduct, "Product created");
    }

    // [PATCH] /admin/product/:productId
    async updateProduct(
        req: Request<{ productId: string }, {}, ProductUpdateInput>,
        res: Response,
        next: NextFunction
    ) {
        const productId = req.params.productId;
        const update = req.body;

        const updatedProduct = await productService.updateById(productId, update);

        if (!updatedProduct) return ResponseHandler.error(res, "Product not found.", 404);

        ResponseHandler.success(res, updatedProduct, "Product updated");
    }

    // [DELETE] /admin/product/:productId
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.params;
        const deletedProduct = await productService.deleteById(productId);

        if (!deletedProduct) {
            return ResponseHandler.error(res, "Product not found.", 404);
        }

        ResponseHandler.success(res, null, "Product deleted successfully");
    }
}

export default new AdminProductController();
