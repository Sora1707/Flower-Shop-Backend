import * as dotenv from "./dotenv";
dotenv.config();

import express, { Application, Request, Response } from "express";
import userRouter from "@/routes/userRoutes"
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";

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
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to our Flower Shop!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
