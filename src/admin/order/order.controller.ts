import { NextFunction, Request, Response } from "express";

import { orderService } from "@/order";

import ResponseHandler from "@/utils/ResponseHandler";

class AdminOrderController {
    async getOrders(req: Request, res: Response, next: NextFunction) {
        const orders = await orderService.findMany(req.query);

        ResponseHandler.success(res, orders, "Orders found");
    }

    async getOrderById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const order = await orderService.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        ResponseHandler.success(res, order, "Order found");
    }

    // TODO: Update Order
    async updateOrder(req: Request, res: Response, next: NextFunction) {}
}

export default new AdminOrderController();
