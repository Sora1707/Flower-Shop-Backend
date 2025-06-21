import { Request, Response, NextFunction } from "express";

import { IOrderItem, orderService } from "./";
import { cartService } from "@/cart";
import { Types } from "mongoose";
import { create } from "domain";
import { ContactInfo, OrderStatus } from "./order.interface";
import { userService } from "@/user";
import { AuthRequest } from "@/types/request";
import { SelectedFieldsObject } from "@/services/base.service";

// API root: /api/order

class OrderController {
    // [GET] /
    async getAllOrders(req: Request, res: Response, next: NextFunction) {
        try {
            const orders = await orderService.findAll();
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    }

    // [GET] /:id
    async getOrderById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const order = await orderService.findById(id);

            if (!order) {
                return res.status(404).json({ message: "Order not found." });
            }
            res.status(200).json(order);
        }
        catch (error) {
            next(error);
        }
    }

    // [GET] /user/orders (in UserRoutes)
    async getOrdersOfUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?._id;
            // return res.status(400).json({ userId });
            const orders = await orderService.findMany({ user: userId });

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: "No orders found for this user." });
            }
            res.status(200).json(orders);
        }
        catch (error) {
            next(error);
        }
    }

    // [POST] / 
    async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const authUser = req.user;
            const userId = authUser?._id;

            const { selectedItems, address } = req.body;

            if (!selectedItems || !Array.isArray(selectedItems) || selectedItems.length === 0) {
                return res.status(400).json({ message: "No selected items provided." });
            }

            const cart = await cartService.findOne({ user: userId });
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(404).json({ message: "Cart is empty" });
            }

            const selectedCartItems = cart.items.filter((item) =>
                selectedItems.includes(item.product.toString())
            );

            if (selectedCartItems.length === 0) {
                return res.status(400).json({ message: "No matching items found in cart." });
            }

            const user = await userService.findById(userId as string);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
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
                const newItem = {
                    product: item.product,
                    quantity: item.quantity,
                    priceAtAddTime: item.priceAtAddTime,
                } as IOrderItem;

                orderItems.push(newItem);
                totalPrice += newItem.quantity * (newItem.priceAtAddTime || 0);
            }

            const order = await orderService.create({
                user: new Types.ObjectId(userId as string),
                items: orderItems,
                contactInfo,
                status: OrderStatus.PENDING,
                totalPrice,
            });

            
            cart.items = cart.items.filter(
                (item) => !selectedItems.includes(item.product.toString())
            );
            await cart.save();

            res.status(201).json({ message: "Order created", order });
        } catch (error) {
            next(error);
        }
    }


    // [DELETE] /:id
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

    // [DELETE] /:userId
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

    // [DELETE] /
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
