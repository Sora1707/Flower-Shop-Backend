import * as dotenv from "./dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import userRouter from "@/user/user.routes";
import productRouter from "@/product/product.routes";
import cartRouter from "@/cart/cart.routes";
import tempRouter from "./temp.routes";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { connectDB } from "./config/db";

// Database connection
connectDB();

const app: Application = express();

/* GLOBAL MIDDLEWARES */
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Public path
app.use(express.static(path.join(__dirname, "public")));

// Support JSON format
app.use(express.json());

// Logging
app.use(morgan("dev"));

/* ROUTING */
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api", cartRouter);

// temporary route for testing
app.use("/api/temp", tempRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
