import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "@/types/request";
import productService from "@/product/product.service";
import userService from "@/user/user.service";

import cartService from "./cart.service";
import { ICartItem } from "./cartItem.interface";

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
            const { productId } = req.params;
            const userId = req.user?._id;
            const { quantity } = req.body;

            let cart = await cartService.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            const existingItem = cart.items.find(
                (item: ICartItem) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += Number(quantity);
            } else {
                const product = await productService.findById(productId);
                const newItem = {
                    product: product?._id,
                    quantity,
                    priceAtAddTime: product?.price,
                } as ICartItem;

                cart.items.push(newItem);
            }

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /cart
    async updateItemQuantity(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const { productId, quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({ message: "Invalid quantity value" });
            }

            const cart = await cartService.findOne({ user: userId });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            const existingItem = cart.items.find(
                (item: ICartItem) => item.product.toString() === productId
            );

            if (!existingItem) {
                return res.status(404).json({ message: "Item not found in the cart" });
            }

            existingItem.quantity = quantity;
            await cart.save();

            res.status(200).json(cart);
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /cart/:productId
    async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            const { productId } = req.params;
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
