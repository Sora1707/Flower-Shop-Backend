import ResponseHandler from "@/utils/ResponseHandler";
import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function validateBody(schema: ZodTypeAny) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            ResponseHandler.error(res, "Validation Error", 400, result.error.flatten());
            return;
        }

        req.body = result.data;
        next();
    };
}

export function validateQuery(schema: ZodTypeAny) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            ResponseHandler.error(res, "Validation Error", 400, result.error.flatten());
            return;
        }

        req.query = result.data;
        next();
    };
}

export function validateParams(schema: ZodTypeAny) {
    return function (req: Request, res: Response, next: NextFunction) {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            ResponseHandler.error(res, "Validation Error", 400, result.error.flatten());
            return;
        }

        req.params = result.data;
        next();
    };
}
