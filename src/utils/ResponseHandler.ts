import { Response } from "express";

class ResponseHandler {
    static success<T>(res: Response, data: T, message = "Success", statusCode = 200) {
        const payload = {
            success: true,
            message,
            data,
        };
        return res.status(statusCode).json(payload);
    }

    static error(res: Response, message = "Error occurred", statusCode = 400, errors?: any) {
        const payload = {
            success: false,
            message,
            ...(errors ? { errors } : {}),
        };
        return res.status(statusCode).json(payload);
    }
}

export default ResponseHandler;
