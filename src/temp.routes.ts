import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import userService from "./user/user.service";
import productService from "./product/product.service";
import { randomInt } from "./utils/number";
import cartService from "./cart/cart.service";
import { Types } from "mongoose";
import { ICart } from "./cart/cart.interface";
import orderService from "./order/order.service";

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
        const user = await userService.findOne({});
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

const router = express.Router();

router.get("/reload_sample_data", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await reloadSampleUsers();
        await reloadSampleProducts();
        await createSampleCart();
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

export default router;
