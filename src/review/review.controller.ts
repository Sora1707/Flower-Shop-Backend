import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "@/types/request";

import reviewService from "./review.service";

class ReviewController {
    // POST /products/:id/review
    async createReview(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }

            const rating = req.body.rating as number;
            const comment = req.body.comment as string;
            const userId = req.user.id;
            const productId = req.params.id;

            if (!rating || !comment) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            if (await reviewService.checkExists({ user: userId, product: productId })) {
                return res.status(400).json({
                    message: "Review for this product already exists",
                });
            }

            const reviewData = {
                user: userId,
                product: new Types.ObjectId(productId),
                rating,
                comment,
            };

            const newReview = await reviewService.create(reviewData);

            res.status(201).json(newReview);
        } catch (error) {
            next(error);
        }
    }
}

const reviewController = new ReviewController();
export default reviewController;
