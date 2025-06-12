import { BaseService } from "@/services/base.service";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

class ProductService extends BaseService<IProduct> {
    protected model = ProductModel;
}

export const productService = new ProductService();
