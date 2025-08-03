import { Request, Response, NextFunction } from "express";

import { IOrderItem, orderService } from "./";
import { cartService } from "@/cart";
import { Types } from "mongoose";
import { create } from "domain";
import { ContactInfo, OrderStatus } from "./order.interface";
import { userService } from "@/user";
import { AuthRequest } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";
import { IProduct, productService } from "@/product";
import { CartItemSchema } from "@/cart/cartItem.schema";
import { royaltyService } from "@/royalty/royalty.service";
import { RoyaltyPointAction } from "@/royalty/royalty.interface";

class OrderController {
    // [GET] /order
    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await orderService.findAll();
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /order/:id
    async getOrderById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const order = await orderService.findById(id);

            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/order
    async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }

            const userId = req.user.id;
            const { page, limit } = req.query;
            const paginateOptions = {
                page: page ? parseInt(page as string, 10) : 1,
                limit: limit ? parseInt(limit as string, 10) : 10,
            };
            const orders = await orderService.paginate({ user: userId }, paginateOptions);

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "No orders found for this user." });
            }
            res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    }

    // [GET] /user/order/:orderId
    async getUserOrderById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }
            const userId = req.user.id;
            const orderId = req.params.orderId;

            const order = await orderService.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }

            if (order.user != userId) {
                return res
                    .status(403)
                    .json({ message: "You are not authorized to view this order." });
            }

            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }

    // [POST] /order/
    async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;

            const { selectedItems, address } = req.body;

            if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
                return res.status(400).json({ message: "No selected items provided." });
            }

            const cart = await cartService.findOne({ user: userId });

            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(404).json({ message: "Cart is empty" });
            }

            const selectedCartItems = cart.items.filter(item =>
                selectedItems.includes(item.product.toString())
            );

            if (selectedCartItems.length === 0) {
                return ResponseHandler.error(res, "The cart is empty", 404);
            }

            const user = await userService.findById(userId as string);
            if (!user) {
                return ResponseHandler.error(res, "This user does not exist", 404);
            }

            const contactInfo: ContactInfo = {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phoneNumber,
                address: address,
            };

            let totalPrice = 0;
            const orderItems: IOrderItem[] = [];

            for (const item of selectedCartItems) {
                const populatedItem = await item.populate<{ product: IProduct }>("product");
                const product = populatedItem.product;
                const quantityToOrder = item.quantity;

                if ( !product.isAvailable || product.stock < quantityToOrder) {
                    return ResponseHandler.error(res, `Product ${product.name} is not available or out of stock`, 400);
                }

                product.stock -= quantityToOrder;
                if (product.stock === 0) {
                    product.isAvailable = false;
                }

                await product.save();

                const newItem = {
                    product: item.product,
                    quantity: item.quantity,
                    priceAtAddTime: item.priceAtAddTime,
                } as IOrderItem;

                orderItems.push(newItem);
                totalPrice += newItem.quantity * (newItem.priceAtAddTime || 0);
            }

            totalPrice = Math.round(totalPrice * 100) / 100;
            const order = await orderService.create({
                user: new Types.ObjectId(userId as string),
                items: orderItems,
                contactInfo,
                status: OrderStatus.PENDING,
                totalPrice,
            });

            await royaltyService.create({
                user: order.user,
                orderId: order._id as Types.ObjectId,
                points: Math.floor(order.totalPrice / 10),
                type: "EARNED" as RoyaltyPointAction,
                description: `Points from order ${order._id}`,
            });

            cart.items = cart.items.filter(
                item => !selectedItems.includes(item.product.toString())
            );
            await cart.save();

            ResponseHandler.success(res, order, "Order created successfully", 201);
        } catch (error) {
            next(error);
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction) {}

    // [DELETE] /order/:id
    async deleteOrderById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedOrder = await orderService.deleteById(id);

            if (!deletedOrder) {
                return res.status(404).json({ message: "Order not found." });
            }

            res.status(200).json({ message: "Order deleted successfully." });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /order/:userId
    async deleteOrderByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const deletedOrders = await orderService.deleteMany({ user: userId });

            if (deletedOrders.deletedCount === 0) {
                return res.status(404).json({ message: "No orders found for this user." });
            }

            res.status(200).json({ message: "Orders deleted successfully." });
        } catch (error) {
            next(error);
        }
    }

    // [DELETE] /order/
    async deleteAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const deletedOrders = await orderService.deleteAll();

            if (deletedOrders.deletedCount === 0) {
                return res.status(404).json({ message: "No orders found to delete." });
            }

            res.status(200).json({ message: "All orders deleted successfully." });
        } catch (error) {
            next(error);
        }
    }
}

const orderController = new OrderController();
export default orderController;
