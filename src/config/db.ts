import mongoose from "mongoose";

import { MONGO_URI } from "./dotenv";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected successfully to ${MONGO_URI}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
