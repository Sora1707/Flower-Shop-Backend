import { NextFunction, Request, Response } from "express";

import { productService } from "@/product";

import ResponseHandler from "@/utils/ResponseHandler";
import { ProductCreateInput } from "./product.validation";

class AdminProductController {
    // TODO: Validate
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const newProduct = await productService.create(req.body);

        ResponseHandler.success(res, newProduct, "Product created");
    }

    async updateProduct(
        req: Request<{ id: string }, {}, ProductCreateInput>,
        res: Response,
        next: NextFunction
    ) {
        const id = req.params.id;
        const update = req.body;

        const updatedProduct = await productService.updateById(id, update);

        if (!updatedProduct) {
            return ResponseHandler.error(res, "Product not found.", 404);
        }

        ResponseHandler.success(res, updatedProduct, "Product updated");
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const deletedProduct = await productService.deleteById(id);

        if (!deletedProduct) {
            return ResponseHandler.error(res, "Product not found.", 404);
        }

        ResponseHandler.success(res, null, "Product deleted successfully");
    }
}

export default new AdminProductController();
