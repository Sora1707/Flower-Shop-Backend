import { BaseService } from "@/services/base.service";
import { ICart } from "./cart.interface";
import { CartModel } from "./cart.model";

class CartService extends BaseService<ICart> {
    protected model = CartModel;

    public async calculateTotal(cartId: string): Promise<number> {
        const cart = await this.model.findById(cartId).populate("items.product");
        if (!cart) {
            throw new Error("Cart not found");
        }
        return cart.items.reduce((total, item) => total + item.priceAtAddTime * item.quantity, 0);
    }
}

const cartService = new CartService();
export default cartService;
