import express from "express";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "@/middleware/asyncHandler";
import { userService } from "./user/user.service";
import { deepCopy } from "@/utils";

const router = express.Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = require("@/data/users.json");
        const userData = deepCopy(users[0]);
        userData.username = "temp";
        userData.password = "temp";
        userData.email = "temp@gmail.com";
        const newUser = await userService.create(userData);
        res.status(200).json(newUser);
    } catch (error) {
        next(error);
    }
});

export default router;
