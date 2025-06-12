import { BaseService } from "@/services/base.service";
import { ICart } from "./cart.interface";
import { CartModel } from "./cart.model";

class CartService extends BaseService<ICart> {
    protected model = CartModel;
}

const cartService = new CartService();
export default cartService;
