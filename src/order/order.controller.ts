import { Request, Response, NextFunction } from "express";

import { IOrderItem, orderService } from "./";
import priceRuleService from "@/priceRule/priceRule.service"; 
import { cartService } from "@/cart";
import mongoose, { Types } from "mongoose";
import { create } from "domain";
import { ContactInfo, IOrder, OrderStatus } from "./order.interface";
import { userService } from "@/user";
import { AuthRequest } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";
import { IProduct, ProductModel, productService } from "@/product";
import { CartItemSchema } from "@/cart/cartItem.schema";
import { royaltyService } from "@/royalty/royalty.service";
import { RoyaltyPointAction } from "@/royalty/royalty.interface";
import { PaymentMethod, PaymentStatus } from "@/payment/payment.interface";
import { IStripeCardDocument, stripeService } from "@/payment/stripe";

class OrderController {
    // [GET] /user/order
    async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return ResponseHandler.error(res, "User not authenticated", 401);
        }

        const userId = req.user.id;
        const { page, limit } = req.query;
        const paginateOptions = {
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        };
        const orders = await orderService.paginate({ user: userId }, paginateOptions);

        if (!orders || orders.length === 0) {
            return ResponseHandler.error(res, "No orders found for this user.", 404);
        }

        return ResponseHandler.success(res, orders, "Orders retrieved successfully");
    }

    // [GET] /user/order/:orderId
    async getUserOrderById(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const userId = req.user.id;
        const orderId = req.params.orderId;

        const order = await orderService.findById(orderId);

        if (!order) {
            return ResponseHandler.error(res, "Order not found", 404);
        }

        if (order.user != userId) {
            return ResponseHandler.error(res, "You are not authorized to view this order.", 403);
        }

        return ResponseHandler.success(res, order, "Order retriever successfully");
    }

    // [POST] /order/
    async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return ResponseHandler.error(res, "User not authenticated", 401);
        }

        const user = req.user;

        const { items, contactInfo, paymentMethod, paymentId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return ResponseHandler.error(res, "No items provided", 400);
        }

        const productIds = items.map((item: IOrderItem) => item.product);

        const products = await ProductModel.find({_id : { $in: productIds }})
                    .select("_id price createdAt dailyRuleID promotionIds")
                    .lean();
        
        const productMap = new Map(products.map((p: any) => [String(p._id), p]))

        const recalculatedItems = await Promise.all(
            items.map(async (item: any) => {
            const key = String(item.product ?? item.productId);
            const p = productMap.get(key);
            if (!p) {
                return ResponseHandler.error(res, `Product not found: ${key}`, 404);
            }

            const adjustedPrice = await priceRuleService.applyRulesToProduct({
                price: p.price,
                createdAt: new Date(p.createdAt),
                dailyRuleID: p.dailyRuleID,
                promotionIds: p.promotionIds ?? [],
            });

            return {
                ...item,
                priceAtAddTime: adjustedPrice,
            };
            })
        );


        const totalPrice = recalculatedItems.reduce(
            (sum, item) => sum + item.priceAtAddTime * item.quantity,
            0
        );

        const orderObject = {
            user: user.id,
            items: recalculatedItems,
            contactInfo,
            status: OrderStatus.Pending,
            paymentStatus: PaymentStatus.Pending,
            paymentMethod,
            shippingPrice: 0,
            totalPrice,
        } as Partial<IOrder>;

        if (paymentMethod === PaymentMethod.Cash) {
            orderObject.status = OrderStatus.Processing;
            orderObject.paymentStatus = PaymentStatus.Success;
            orderObject.isPaid = true;
            orderObject.paidAt = new Date();

            const order = await orderService.create(orderObject);

            return ResponseHandler.success(res, order, "Order created successfully");
        }

        const cards = user.cards as IStripeCardDocument[];
        const card = cards.find((card) => card.id === paymentId);

        if (!card) {
            return ResponseHandler.error(res, "Card not found", 404);
        }

        orderObject.paymentMethodId = card.paymentMethodId;

        const order = await orderService.create(orderObject);

        const session = await mongoose.startSession();
        session.startTransaction();

        // * Replicate processing transaction
        await new Promise((resolve) => setTimeout(resolve, 5000));

        try {
            const paymentIntent = await stripeService.createPaymentIntent({
                customerId: user.stripeCustomerId,
                paymentMethodId: card.paymentMethodId,
                amount: order.totalPrice * 100,
                currency: "usd",
            });

            order.status = OrderStatus.Processing;
            order.paymentStatus = PaymentStatus.Success;
            order.paymentIntentId = paymentIntent.id;
            order.isPaid = true;
            order.paidAt = new Date();

            await order.save({});

            await session.commitTransaction();
            session.endSession();

            return ResponseHandler.success(res, order, "Order created successfully", 201);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            order.status = OrderStatus.Failed;
            order.paymentStatus = PaymentStatus.Failed;
            order.orderFailureReason = (error as Error).message;

            await order.save();

            return ResponseHandler.error(res, "Order creation failed", 500, (error as Error).message);
        }
    }
}

const orderController = new OrderController();
export default orderController;
