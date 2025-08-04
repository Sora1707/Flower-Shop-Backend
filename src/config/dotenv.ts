import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

function config() {
    const mode = process.env.NODE_ENV || "development";
    const envFile = `.env.${mode}`;
    const envPath = resolve(process.cwd(), envFile);

    if (existsSync(envPath)) {
        dotenv.config({ path: envPath });
    } else {
        dotenv.config();
        console.warn(`⚠️ No ${envFile} found, falling back to default .env`);
    }
}

config();
export const APPLICATION_MODE = process.env.NODE_ENV || "development";
export const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/default";
export const PORT = process.env.PORT || 5000;
export const {
    BASE_URL,
    FRONT_END_PORT,
    FRONT_END_IP,
    JWT_SECRET,
    RESET_PASSWORD_SECRET,
    EMAIL_HOST,
    EMAIL_PASSWORD,
    ARCJET_KEY,
    ARCJET_ENV,
    STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY,
} = process.env;
