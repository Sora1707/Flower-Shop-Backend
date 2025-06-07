import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

export function config() {
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
