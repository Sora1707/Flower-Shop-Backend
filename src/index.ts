import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "path";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger";

import { FRONT_END_IP, FRONT_END_PORT, PORT } from "./config/dotenv";

import { connectDB } from "./config/db";

import errorHandler from "./middleware/errorHandler";
import arcjetMiddleware from "./middleware/arcjet.middleware";
import asyncHandler from "./middleware/asyncHandler";

import cartRouter from "@/cart/cart.routes";
import orderRouter from "@/order/order.routes";
import productRouter from "@/product/product.routes";
import reviewRouter from "@/review/review.routes";
import userRouter from "@/user/user.routes";
import tempRouter from "./temp.routes";
import uploadRouter from "./upload.routes";

// Database connection
connectDB();

const app: Application = express();

/* GLOBAL MIDDLEWARES */
// Swagger
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Support JSON format
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Logging
app.use(morgan("dev"));

// CORS
app.use(
    cors({
        origin: [`${FRONT_END_IP}:${FRONT_END_PORT}`, `http://127.0.0.1:${FRONT_END_PORT}`],
        credentials: true,
    })
);

// Public (Static) files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

/* ROUTING */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);

// temporary route for testing
app.use("/api/temp", tempRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error Handler Must be at last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`[DEVELOPMENT] Frontend at port ${process.env.FRONT_END_PORT}`);
});
