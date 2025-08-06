import { BaseService } from "@/services";

import { ICart, ICartDocument } from "./cart.interface";
import { CartModel } from "./cart.model";

class CartService extends BaseService<ICartDocument> {
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
