import { Request, Response, NextFunction } from "express";

import { productService } from "./";
import { extractProductOptionsFromRequest } from "./requestQuery";

// API root: /api/product

class ProductController {
    // [GET] /
    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { filters, paginateOptions } = extractProductOptionsFromRequest(req);

            const result = await productService.paginate(filters, paginateOptions);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /:id
    async getProductById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const product = await productService.findById(id);

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /search
    async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { filters, paginateOptions } = extractProductOptionsFromRequest(req);

            const result = await productService.paginate(filters, paginateOptions);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // [POST] /
    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const newProduct = await productService.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /:id
    async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const update = req.body;

            const updatedProduct = await productService.updateById(id, update);

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found." });
            }
            res.status(200).json({ message: "Product updated", product: updatedProduct });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /:id
    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedProduct = await productService.deleteById(id);

            if (!deletedProduct) {
                return res.status(404).json({ message: "Product not found." });
            }

            res.status(200).json({ message: "Product deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}

const productController = new ProductController();
export default productController;
