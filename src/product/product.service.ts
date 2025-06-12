import { BasePaginateService } from "@/services/base.service";
import { IProduct } from "./product.interface";
import { ProductModel } from "./product.model";

class ProductService extends BasePaginateService<IProduct> {
    protected model = ProductModel;
}

const productService = new ProductService();
export default productService;
