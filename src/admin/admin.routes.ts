import { Router } from "express";

import asyncHandler from "@/middleware/asyncHandler.middelware";
import { isAdmin } from "@/middleware/authorize.middleware";
import authenticate from "@/middleware/authenticate.middelware";

import userRouter from "./user/user.routes";
import orderRouter from "./order/order.routes";
import productRouter from "./product/product.routes";

const router = Router();
router.use(asyncHandler(authenticate));
router.use(isAdmin);

router.use("/user", userRouter);
router.use("/order", orderRouter);
router.use("/product", productRouter);

export default router;
