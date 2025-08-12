import { Options } from "swagger-jsdoc";
import { BASE_URL } from "./dotenv";

export const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flower Shop API",
            version: "1.0.0",
            description: "API documentation for your e-commerce flower shop",
        },
        servers: [{ url: `${BASE_URL}/api` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        // "./src/**/*docs.ts"
        "./src/docs/*.docs.ts",
        "./src/auth/**/*.docs.ts",
        "./src/user/**/*.docs.ts",
        "./src/product/**/*.docs.ts",

        "./src/admin/user/**/*.docs.ts",
        "./src/admin/product/**/*.docs.ts",
    ], // Path to your route/controller files
};
