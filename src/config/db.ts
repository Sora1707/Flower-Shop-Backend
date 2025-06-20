import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/default";
console.log(MONGO_URI);
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected successfully to ${MONGO_URI}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
