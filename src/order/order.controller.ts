import { Request, Response, NextFunction } from "express";

import { orderService } from "./";
import { cartService } from "@/cart";
import { Types } from "mongoose";
import { create } from "domain";

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

    // [POST] /
    async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params; 

            const cart = await cartService.findOne({ user: userId });
            if (!cart || cart.items.length === 0 || !cart.items) {
                return res.status(404).json({ message: "Cart is empty" });
            }

            const orderItems = cart.items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                priceAtAddTime: item.priceAtAddTime,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt
            }));

            const userObjectId = new Types.ObjectId(userId);
            const order = await orderService.create({
                user: userObjectId,   
                // items: orderItems,
                // totalAmount:
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
