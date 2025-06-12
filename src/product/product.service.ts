import BaseService from "@/services/base.service";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

class ProductService extends BaseService<IProduct> {
    protected model = ProductModel;
}

const productService = new ProductService();
export default productService;
