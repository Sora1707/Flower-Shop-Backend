import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import path from "path";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { swaggerOptions } from "./config/swagger";

import { APPLICATION_MODE, FRONT_END_URL, PORT } from "./config/dotenv";

import { connectDB } from "./config/db";

import errorHandler from "./middleware/errorHandler.middelware";
import arcjetMiddleware from "./middleware/arcjet.middleware";
import asyncHandler from "./middleware/asyncHandler.middelware";

import apiRouter from "@/auth/auth.routes";
import cartRouter from "@/cart/cart.routes";
import orderRouter from "@/order/order.routes";
import productRouter from "@/product/product.routes";
import reviewRouter from "@/review/review.routes";
import userRouter from "@/user/user.routes";
import priceRuleRouter from "@/priceRule/priceRule.routes";
import tempRouter from "./temp/";
import uploadRouter from "./upload.routes";
import royaltyRoutes from "./royalty/royalty.routes";

// Database connection
connectDB();

const app: Application = express();

/* GLOBAL MIDDLEWARES */
// Swagger Documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
        origin: [FRONT_END_URL],
        credentials: true,
    })
);

// Rate limiting and Bot detection
app.use(asyncHandler(arcjetMiddleware));

// Public (Static) files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", express.static(path.join(__dirname, "public")));

/* ROUTING */
app.use("/api/auth", apiRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/price-rule", priceRuleRouter);
app.use("/api/royalty", royaltyRoutes);

// temporary route for testing
app.use("/api/temp", tempRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error Handler Must be at last
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Application is running at ${APPLICATION_MODE.toUpperCase()} mode`);
    console.log(`Server running on port ${PORT}`);
    console.log("Swagger docs:  http://localhost:3000/api-docs");
    console.log(`Frontend: ${FRONT_END_URL}`);
});
