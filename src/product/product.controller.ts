import { Request, Response, NextFunction } from "express";
import productService from "./product.service";

class ProductController {
    async getAllProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                category, 
                isAvailable, 
                minPrice, 
                maxPrice, 
                sortBy = "createdAt", // Default: Sort by created date
                sortOrder = "desc"  // Default: Sort descending
            } = req.query;

            const sortField = String(sortBy);

            // Prepare filters for category, price range, and availability
            const filters: any = {
                category: category ? (category as string).split(",") : undefined, // phai them 'as string' de k bi loi string[]
                isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined
            };

            // Prepare sorting criteria
            const sort: any = {};
            if (sortOrder === "asc") {
                sort[sortField] = 1; // Ascending order
            } else {
                sort[sortField] = -1; // Descending order
            }

            // Call the service method to get filtered, sorted, and paginated products
            const products = await productService.getProductsWithFilters(
                Number(page),  
                Number(limit), 
                filters,       
                sort           
            );

            res.status(200).json(products);
        } catch (error) {
            next(error);  
        }
    }

    async createProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const newProduct = await productService.create(req.body);
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    }

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

    async searchProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query.query?.toString() || "";
            const results = await productService.searchProducts(query);
            res.status(200).json(results);
        } catch (error){
            next(error)
        }
    }
}

const productController = new ProductController();
export default productController;
