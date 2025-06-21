import express from "express";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import asyncHandler from "@/middleware/asyncHandler";

import { randomInt } from "./utils/number";
import { userService } from "@/user";
import { productService } from "@/product";
import { cartService, ICart } from "@/cart";
import { IOrder, OrderStatus, orderService } from "@/order";
import { ReviewModel, reviewService } from "@/review";

async function reloadSampleUsers() {
    try {
        const users = require("@/data/users.json");
        await userService.deleteAll();
        const newUsers = await userService.createMany(users);
    } catch (error) {
        console.error("Error reloading sample users:", error);
    }
}

async function reloadSampleProducts() {
    try {
        const products = require("@/data/products.json");
        await productService.deleteAll();
        const newProducts = await productService.createMany(products);
    } catch (error) {
        console.error("Error reloading sample products:", error);
    }
}

async function createSampleCart() {
    try {
        await cartService.deleteAll();
        const user = await userService.findOne({ username: "sora" });
        const products = await productService.findAll();
        const slicedProducts = products.slice(0, 3);

        if (!user) {
            console.error("No user found to create a sample cart for.");
            return;
        }

        const cartData = {
            user: user.id as Types.ObjectId,
            items: slicedProducts.map(product => {
                const quantity = randomInt(1, 3);
                return {
                    product: product.id as Types.ObjectId,
                    quantity,
                    priceAtAddTime: product.price,
                };
            }),
        };
        const newCart = await cartService.create(cartData as Partial<ICart>);
    } catch (error) {
        console.error("Error creating sample cart:", error);
    }
}

async function createSampleOrder() {
    try {
        await orderService.deleteAll();
        const user1 = await userService.findOne({ username: "sora" });
        const user2 = await userService.findOne({ username: "sora1" });
        const products = await productService.findAll();

        if (!user1 || !user2) {
            console.error("No user found to create a sample cart for.");
            return;
        }

        const orderData = {
            user: user1.id as Types.ObjectId,
            items: [
                {
                    product: products[0].id as Types.ObjectId,
                    quantity: 1,
                    priceAtAddTime: products[0].price,
                },
            ],
            status: OrderStatus.COMPLETED,
            contactInfo: {
                name: "sora",
                email: "sora@me.com",
                phone: "1234567890",
                address: "123 Main St, Anytown, USA",
            },
            totalPrice: products[0].price,
        };

        await orderService.create(orderData as Partial<IOrder>);

        orderData.user = user2.id as Types.ObjectId;

        await orderService.create(orderData as Partial<IOrder>);
    } catch (error) {
        console.error("Error creating sample order:", error);
    }
}

const router = express.Router();

router.post("/reload_sample_data", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await reloadSampleUsers();
        await reloadSampleProducts();
        await createSampleCart();
        await createSampleOrder();
        res.status(200).json({ message: "Successfully reloaded sample data." });
    } catch (error) {
        next(error);
    }
});

router.get("/get_all", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.findAll();
        const products = await productService.findAll();
        const carts = await cartService.findAll();
        const orders = await orderService.findAll();
        await ReviewModel.collection.dropIndex("userId_1_productId_1");
        await reviewService.deleteAll();

        res.status(200).json({
            message: "Successfully retrieved all data.",
        });
    } catch (error) {
        next(error);
    }
});

export default router;
