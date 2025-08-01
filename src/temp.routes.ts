import { NextFunction, Request, Response, Router } from "express";
import { Types } from "mongoose";

import { cartService, ICart } from "@/cart";
import { IOrder, orderService, OrderStatus } from "@/order";
import { productService } from "@/product";
import { reviewService } from "@/review";
import { userService } from "@/user";
import { randomInt } from "./utils/number";
import withTransaction from "./utils/withTransaction";

async function reloadSampleUsers() {
    try {
        const users = require("@/data/users.json");
        await userService.deleteAll();
        await userService.createMany(users);
    } catch (error) {
        console.error("Error reloading sample users:", error);
    }
}

async function reloadSampleProducts() {
    try {
        const products = require("@/data/products.json");
        await productService.deleteAll();
        await productService.createMany(products);
    } catch (error) {
        console.error("Error reloading sample products:", error);
    }
}

async function createSampleCart() {
    try {
        await cartService.deleteAll();

        const users = await userService.findAll();
        for (const user of users) {
            await cartService.create({ user: user.id as Types.ObjectId });
        }

        const user = await userService.findOne({ username: "sora1" });
        const products = await productService.findAll();
        const slicedProducts = products.slice(0, 3);

        const cartData = {
            items: slicedProducts.map(product => {
                const quantity = randomInt(1, 3);
                return {
                    product: product.id,
                    quantity,
                    priceAtAddTime: product.price,
                };
            }),
        };

        await cartService.updateOne(
            { user: user!.id as Types.ObjectId },
            cartData as Partial<ICart>
        );
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
                phoneNumber: "1234567890",
                postalCode: "12345",
                address: "123 Main St, Anytown, USA",
            },
            paymentMethod: "cash",
            shippingPrice: 0,
            totalPrice: products[0].price,
        };

        await orderService.create(orderData as Partial<IOrder>);

        orderData.user = user2.id as Types.ObjectId;

        await orderService.create(orderData as Partial<IOrder>);
    } catch (error) {
        console.error("Error creating sample order:", error);
    }
}

const router = Router();

router.post("/reload_sample_data", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await withTransaction(async session => {
            await reloadSampleUsers();
            await reloadSampleProducts();
            await createSampleCart();
            await createSampleOrder();
            await reviewService.deleteAll();
        });

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

        res.status(200).json({
            message: "Successfully retrieved all data.",
        });
    } catch (error) {
        next(error);
    }
});

router.get("/user/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        const user = await userService.findOne({ username });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});
// IMAGE UPLOAD

export default router;
