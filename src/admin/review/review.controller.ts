import { NextFunction, Request, Response } from "express";

import { productService } from "@/product";

import ResponseHandler from "@/utils/ResponseHandler";

class AdminReviewController {
    async getReviews(req: Request, res: Response, next: NextFunction) {}

    async deleteReviewById(req: Request, res: Response, next: NextFunction) {}
}

export default new AdminReviewController();
