import { Options } from "swagger-jsdoc";

export const swaggerOptions: Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flower Shop API",
            version: "1.0.0",
            description: "API documentation for your e-commerce flower shop",
        },
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
        servers: [
            {
                url: "http://localhost:8080/api",
            },
        ],
    },
    apis: ["./src/**/*docs.ts"], // Path to your route/controller files
};
