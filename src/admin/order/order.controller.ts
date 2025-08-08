import { NextFunction, Request, Response } from "express";

import { isSafeOrderStatusUpdate, orderService, OrderStatus } from "@/order";

import ResponseHandler from "@/utils/ResponseHandler";
import { userService } from "@/user";

class AdminOrderController {
    // [GET] /admin/order
    async getOrders(req: Request, res: Response, next: NextFunction) {
        const {} = req.query;

        const orders = await orderService.findMany({});

        ResponseHandler.success(res, orders, "Orders found");
    }

    // [GET] /admin/order/:orderId
    async getOrderById(req: Request, res: Response, next: NextFunction) {
        const { orderId } = req.params;
        const order = await orderService.findById(orderId);

        if (!order) return res.status(404).json({ message: "Order not found." });

        ResponseHandler.success(res, order, "Order found");
    }

    // [GET] /admin/order/user/:userId
    async getUserOrders(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        const user = await userService.findById(userId);
        if (!user) return ResponseHandler.error(res, "User not found.", 404);

        const orders = await orderService.findMany({ user: userId });

        ResponseHandler.success(res, orders, "Orders found");
    }

    // [PATCH] /admin/order/:orderId/status
    async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await orderService.findById(orderId);
        if (!order) return ResponseHandler.error(res, "Order not found.", 404);

        if (status === OrderStatus.Cancelled) {
            // TODO cancel order
            return;
        }
        if (status === OrderStatus.Failed) {
            // TODO handle failed order
            return;
        }
        if (status === OrderStatus.Refunded) {
            // TODO refund order
            return;
        }
        if (isSafeOrderStatusUpdate(order.status, status)) {
            order.status = status;
            await order.save();

            ResponseHandler.success(res, order, "Order status updated");
        }

        ResponseHandler.error(res, "Invalid order status update", 400);
    }

    // [PATCH] /admin/order/:orderId/delivered-at
    async updateOrderDeliveredAt(req: Request, res: Response, next: NextFunction) {
        const { orderId } = req.params;
        const { deliveredAt } = req.body;

        const order = await orderService.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found." });

        order.deliveredAt = deliveredAt;
        order.isDelivered = true;
        await order.save();

        ResponseHandler.success(res, order, "Order delivered at updated");
    }

    // TODO: Update Order
    async updateOrder(req: Request, res: Response, next: NextFunction) {}
}

export default new AdminOrderController();
