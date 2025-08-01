import ResponseHandler from "@/utils/ResponseHandler";
import { NextFunction, Request, Response } from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    ResponseHandler.error(res, err.message || "Server Error", 500, err.name);
}
