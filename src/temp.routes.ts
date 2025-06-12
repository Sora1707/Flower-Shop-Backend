import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import userService from "./user/user.service";
import productService from "./product/product.service";
import { deepCopy } from "@/utils";

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

export default router;
