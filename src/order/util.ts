import { IUser } from "@/user";
import { IOrderItem } from "./orderItem.interface";
import { ICart } from "@/cart";
import { ContactInfo } from "./order.interface";

export function validateCart(cart: ICart, orderItems: IOrderItem[]) {
    const cartItems = [...cart.items];
    // Match cart
    for (const orderItem of orderItems) {
        const cartItem = cartItems.find(
            item => item.product.toString() === orderItem.product.toString()
        );
        if (!cartItem || cartItem.quantity !== orderItem.quantity) {
            return false;
        }
    }

    return true;
}

export function validateAddress(user: IUser, contactInfo: ContactInfo) {
    for (const address of user.addresses) {
        if (
            address.postalCode === contactInfo.postalCode &&
            address.phoneNumber === contactInfo.phoneNumber &&
            address.name === contactInfo.name
        ) {
            return true;
        }
    }
    return false;
}
