import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "@/types/request";

import reviewService from "./review.service";
import { orderService } from "@/order";
import { productService } from "@/product";

class ReviewController {
    async getAllReviews(req: Request, res: Response, next: NextFunction) {
        try {
            const reviews = await reviewService.findAll();
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    }

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

            const product = await productService.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            if (!(await orderService.checkUserHasPurchasedProduct(userId, productId))) {
                return res
                    .status(400)
                    .json({ message: "User has not purchased this product before" });
            }

            if (await reviewService.checkExists({ user: userId, product: productId })) {
                return res.status(400).json({
                    message: "Review for this product already exists",
                });
            }

            if (!rating || !comment) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const reviewData = {
                user: userId,
                product: new Types.ObjectId(productId),
                rating,
                comment,
            };

            const newReview = await reviewService.create(reviewData);

            const currentAvgRating = product.rating.average;
            const currentRatingCount = product.rating.count;
            const newAvgRating =
                (currentAvgRating * currentRatingCount + rating) / (currentRatingCount + 1);

            await productService.updateById(productId, {
                rating: {
                    average: newAvgRating,
                    count: currentRatingCount + 1,
                },
            });

            res.status(201).json(newReview);
        } catch (error) {
            next(error);
        }
    }

    async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }

            const rating = req.body.rating as number;
            const comment = req.body.comment as string;
            const userId = req.user.id;
            const productId = req.params.id;

            const product = await productService.findById(productId);

            if (!product) {
                return res.status(404).json({ message: "Product not found." });
            }

            if (!(await orderService.checkUserHasPurchasedProduct(userId, productId))) {
                return res
                    .status(400)
                    .json({ message: "User has not purchased this product before" });
            }

            if (!rating || !comment) {
                return res.status(400).json({ message: "Missing required fields." });
            }

            const existingReview = await reviewService.findOne({
                user: userId,
                product: productId,
            });

            const newRating = rating;
            const newComment = comment;

            await reviewService.updateOne(
                { user: userId, product: new Types.ObjectId(productId) },
                { rating: newRating, comment: newComment }
            );

            if (!existingReview) {
                return res.status(404).json({ message: "Review not found." });
            }

            const currentAvgRating = product.rating.average;
            const currentRatingCount = product.rating.count;
            const newAvgRating =
                (currentAvgRating * currentRatingCount + newRating - existingReview.rating) /
                currentRatingCount;

            await productService.updateById(productId, {
                rating: {
                    average: newAvgRating,
                    count: currentRatingCount,
                },
            });

            res.status(200).json({ message: "Review updated successfully." });
        } catch (error) {
            next(error);
        }
    }

    async getUserReviews(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }
            const userId = req.user.id;
            const reviews = await reviewService.findMany({ user: userId });
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    }

    async getUserReviewForProduct(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated." });
            }
            const userId = req.user.id;
            const productId = req.params.productId;
            const reviews = await reviewService.findOne({ user: userId, product: productId });
            res.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    }
}

const reviewController = new ReviewController();
export default reviewController;
