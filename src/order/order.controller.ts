import { Request, Response, NextFunction } from "express";

import { IOrderItem, orderService } from "./";
import { cartService } from "@/cart";
import { Types } from "mongoose";
import { create } from "domain";
import { ContactInfo, OrderStatus } from "./order.interface";
import { userService } from "@/user";

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

    // [POST] /:userId
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params; 

            const cart = await cartService.findOne({ user: userId });
            if (!cart || cart.items.length === 0 || !cart.items) {
                return res.status(404).json({ message: "Cart is empty" });
            }

            const user = await userService.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            const contactInfo: ContactInfo = {
                name: user.firstName + " " + user.lastName,    
                email: user.email,
                phone: user.phoneNumber,
                address: "No address provided",
            };

            let totalPrice = 0;
            const orderItems: IOrderItem[] = [];
            for (const item of cart.items) {
                const newItem = {
                    product: item.product,
                    quantity: item.quantity,
                    priceAtAddTime: item.priceAtAddTime,
                } as IOrderItem;
                orderItems.push(newItem);

                totalPrice += newItem.quantity * (newItem.priceAtAddTime || 0);
            }

            const userObjectId = new Types.ObjectId(userId);
            const order = await orderService.create({
                user: userObjectId,   
                items: orderItems,
                contactInfo: contactInfo,
                status: OrderStatus.PENDING,
                totalPrice: totalPrice || 0,
            });

            cart.items = [];
            await cart.save();
        }
        catch (error) {
            next(error);
        }
    }

    // [DELETE] /:id
    async deleteOrder(req: Request, res: Response, next: NextFunction) {
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
}

const orderController = new OrderController();
export default orderController;
