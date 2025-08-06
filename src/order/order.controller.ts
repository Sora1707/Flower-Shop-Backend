import { Request, Response, NextFunction } from "express";

import { IOrderItem, orderService } from "./";
import { cartService } from "@/cart";
import mongoose, { Types } from "mongoose";
import { create } from "domain";
import { ContactInfo, IOrder, OrderStatus } from "./order.interface";
import { userService } from "@/user";
import { AuthRequest } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";
import { IProduct, productService } from "@/product";
import { CartItemSchema } from "@/cart/cartItem.schema";
import { royaltyService } from "@/royalty/royalty.service";
import { RoyaltyPointAction } from "@/royalty/royalty.interface";
import { PaymentMethod, PaymentStatus } from "@/payment/payment.interface";
import { IStripeCardDocument, stripeService } from "@/payment/stripe";

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
        if (!req.user) {
            return;
        }

        const user = req.user;

        const { items, contactInfo, paymentMethod, paymentId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "No selected items provided." });
        }

        // const cart = await cartService.findOne({ user: userId });

        // if (!cart || !cart.items || cart.items.length === 0) {
        //     return res.status(404).json({ message: "Cart is empty" });
        // }

        // const selectedCartItems = cart.items.filter((item) =>
        //     items.includes(item.product.toString())
        // );

        // if (selectedCartItems.length === 0) {
        //     return ResponseHandler.error(res, "The cart is empty", 404);
        // }

        const totalPrice = items.reduce(
            (sum, item) => sum + item.priceAtAddTime * item.quantity,
            0
        );

        const orderObject = {
            user: user.id,
            items: items,
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

            ResponseHandler.success(res, order, "Order created successfully");
            return;
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

            ResponseHandler.success(res, order, "Order created successfully", 201);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            order.status = OrderStatus.Failed;
            order.paymentStatus = PaymentStatus.Failed;
            order.orderFailureReason = (error as Error).message;

            await order.save();

            ResponseHandler.error(res, "Order creation failed", 500, (error as Error).message);
        }

        // const orderItems: IOrderItem[] = [];
        // for (const item of selectedCartItems) {
        //     const populatedItem = await item.populate<{ product: IProduct }>("product");
        //     const product = populatedItem.product;
        //     const quantityToOrder = item.quantity;

        //     if (!product.isAvailable || product.stock < quantityToOrder) {
        //         return ResponseHandler.error(
        //             res,
        //             `Product ${product.name} is not available or out of stock`,
        //             400
        //         );
        //     }

        //     product.stock -= quantityToOrder;
        //     if (product.stock === 0) {
        //         product.isAvailable = false;
        //     }

        //     await product.save();

        // const newItem = {
        //     product: item.product,
        //     quantity: item.quantity,
        //     priceAtAddTime: item.priceAtAddTime,
        // } as IOrderItem;

        // orderItems.push(newItem);
        // totalPrice += newItem.quantity * (newItem.priceAtAddTime || 0);

        // totalPrice = Math.round(totalPrice * 100) / 100;

        // await royaltyService.create({
        //     user: order.user,
        //     orderId: order._id as Types.ObjectId,
        //     points: Math.floor(order.totalPrice / 10),
        //     type: "EARNED" as RoyaltyPointAction,
        //     description: `Points from order ${order._id}`,
        // });

        // cart.items = cart.items.filter(
        //     (item) => !items.includes(item.product.toString())
        // );
        // await cart.save();
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
