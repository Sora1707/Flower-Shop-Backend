import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "@/types/request";

import productService from "@/product/product.service";
import userService from "@/user/user.service";
import cartService from "./cart.service";
import { ICartItem } from "./cartItem.interface";

import { UpdateCartItemQuantityInput } from "./cart.validation";

import ResponseHandler from "@/utils/ResponseHandler";
import { IProduct } from "@/product";
import { ICart, ICartDocument } from "./cart.interface";

class CartController {
    // [GET] /cart/all
    async getAllCarts(req: Request, res: Response, next: NextFunction) {
        try {
            const carts = await cartService.findAll();

            res.status(200).json(carts);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /cart/:userId
    async getCartByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const cart = await cartService.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /cart
    async getUserCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const cart = await cartService.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    // [POST] /:productId/cart (in ProductRoutes)
    async addOrUpdateItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const cart = await cartService.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    // [PATCH] /cart
    async updateItemQuantity(
        req: AuthRequest<{}, {}, UpdateCartItemQuantityInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.user) {
                return;
            }

            const user = req.user;
            const { productId, quantity } = req.body;

            const product = await productService.findById(productId);

            if (!product) {
                return ResponseHandler.error(res, "Product not found", 404);
            }

            const cart = await cartService.findOne({ user: user.id });

            if (!cart) {
                return ResponseHandler.error(res, "Cart not found", 404);
            }

            if (quantity > 0) await this.addItemQuantity(res, cart, product, quantity);
            else await this.removeItemQuantity(res, cart, product, -quantity);

            ResponseHandler.success(res, null, "Successfully updated item quantity");
        } catch (error) {
            next(error);
        }
    }

    private async addItemQuantity(
        res: Response,
        cart: ICartDocument,
        product: IProduct,
        quantity: number
    ) {
        const existingItem = cart.items.find(
            (item: ICartItem) => item.product.toString() === product.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            const newCartItem = {
                product: product.id,
                quantity,
                priceAtAddTime: product.price,
            } as ICartItem;

            cart.items.push(newCartItem);
        }

        await cart.save();
    }

    private async removeItemQuantity(
        res: Response,
        cart: ICartDocument,
        product: IProduct,
        quantity: number
    ) {
        const existingItem = cart.items.find(
            (item: ICartItem) => item.product.toString() === product.id
        );

        if (!existingItem) {
            return ResponseHandler.error(res, "Item not found in the cart", 404);
        }

        existingItem.quantity -= quantity;

        if (existingItem.quantity < 0) {
            return ResponseHandler.error(
                res,
                "The quantity will be negative by subtracting this value",
                400
            );
        }

        if (existingItem.quantity === 0) {
            cart.items = cart.items.filter(
                (item: ICartItem) => item.product.toString() !== product.id
            );
        }

        await cart.save();
    }

    // [DELETE] /cart
    async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const { productId } = req.body;
            const cart = await cartService.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            cart.items = cart.items.filter(
                (item: ICartItem) => item.product.toString() !== productId
            );
            await cart.save();

            res.status(200).json({ message: "Item removed from cart" });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /cart
    async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const clearedCart = await cartService.deleteOne({ user: userId });
            if (!clearedCart) {
                res.status(404).json({ message: "Cart not found" });
            }
            res.status(200).json({ message: "Cart cleared successfully" });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /cart/:userId
    async deleteCartByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const deletedCart = await cartService.deleteOne({ user: userId });
            if (!deletedCart) {
                res.status(404).json({ message: "Cart not found" });
            }
            res.status(200).json({ message: "Cart deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
}

const cartController = new CartController();
export default cartController;
