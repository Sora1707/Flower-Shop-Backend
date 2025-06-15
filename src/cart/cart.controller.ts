import { Request, Response, NextFunction } from "express";
import cartService from "./cart.service";
import { ICart } from "./cart.interface";
import { ICartItem } from "./cartItem.interface";
import { CartItemSchema } from "./cartItem.schema";
import productService from "@/product/product.service";
import { Types } from "mongoose";
import userService from "@/user/user.service";

class CartController {
    // Create a cart for a user
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }

            const user = await userService.findById(userId);
            const existingCart = await cartService.findOne({ user: userId });

            let newCart;
            if (existingCart) {
                newCart = existingCart;
            } else {
                const userObjectId = new Types.ObjectId(userId);
                newCart = await cartService.create({ user: userObjectId, items: [] });
            }

            res.status(201).json(newCart);
        } catch (error) {
            next(error);
        }
    }

    // Get user's cart
    async getCart(req: Request, res: Response, next: NextFunction) {
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

    // Add or update cart item
    async addOrUpdateItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, productId, quantity } = req.body;

            let cart = await cartService.findOne({ user: userId });

            if (!cart) {
                cart = await cartService.create({ user: userId, items: [] });
            }

            // Check if the item already exists
            const existingItem = cart.items.find(
                (item: ICartItem) => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += Number(quantity);
            } else {
                const product = await productService.findById(productId);
                const newItem = {
                    product: productId,
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

    // Update quantity of a cart item
    async updateItemQuantity(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, productId } = req.params;
            const { quantity } = req.body;

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

    // Remove item from cart
    async removeItem(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, productId } = req.params;
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

    // Delete cart
    async deleteOneCart(req: Request, res: Response, next: NextFunction) {
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

    // Delete all carts of an user
    async deleteAllCarts(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const deletedCart = await cartService.deleteAll();
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
