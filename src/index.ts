import * as dotenv from "./dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "path";

import { connectDB } from "./config/db";
import errorHandler from "./middleware/errorHandler";

import cartRouter from "@/cart/cart.routes";
import orderRouter from "@/order/order.routes";
import productRouter from "@/product/product.routes";
import reviewRouter from "@/review/review.routes";
import userRouter from "@/user/user.routes";
import priceRuleRouter from "@/priceRule/priceRule.routes";
import tempRouter from "./temp.routes";
import uploadRouter from "./upload.routes";

// Database connection
connectDB();

const app: Application = express();

/* GLOBAL MIDDLEWARES */
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Public (Static) files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

// Support JSON format
app.use(express.json());

// Logging
app.use(morgan("dev"));

// CORS
app.use(
    cors({
        origin: [
            `http://localhost:${process.env.FRONT_END_PORT}`,
            `http://127.0.0.1:${process.env.FRONT_END_PORT}`,
        ],
        credentials: true,
    })
);

/* ROUTING */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/price-rule", priceRuleRouter);

// temporary route for testing
app.use("/api/temp", tempRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error Handler Must be at last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`[DEVELOPMENT] Frontend at port ${process.env.FRONT_END_PORT}`);
});
