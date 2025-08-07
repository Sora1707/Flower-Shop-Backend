import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { AuthRequest } from "@/types/request";

import reviewService from "./review.service";
import { orderService } from "@/order";
import { productService } from "@/product";

class ReviewController {
    async getAllReviews(req: Request, res: Response, next: NextFunction) {
        const reviews = await reviewService.findAll();
        res.status(200).json(reviews);
    }

    async getReviewsForProduct(req: Request, res: Response, next: NextFunction) {
        const productId = req.params.id;
        const { page, limit } = req.query;
        const paginateOptions = {
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        };
        const reviews = await reviewService.paginate({ product: productId }, paginateOptions);
        res.status(200).json(reviews);
    }

    async createReviewForProduct(req: AuthRequest, res: Response, next: NextFunction) {
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
            return res.status(400).json({ message: "User has not purchased this product before" });
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
    }

    async getUserReviewForProduct(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const userId = req.user.id;
        const productId = req.params.productId;
        const review = await reviewService.findOne({ user: userId, product: productId });

        if (!review) {
            return res.status(404).json({ message: "User has not reviewed this product yet." });
        }

        res.status(200).json(review);
    }

    async getUserReviews(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const userId = req.user.id;
        const { page, limit } = req.query;
        const paginateOptions = {
            page: page ? parseInt(page as string, 10) : 1,
            limit: limit ? parseInt(limit as string, 10) : 10,
        };
        const reviews = await reviewService.paginate({ user: userId }, paginateOptions);
        res.status(200).json(reviews);
    }

    async getReviewById(req: Request, res: Response, next: NextFunction) {
        const reviewId = req.params.id;
        const review = await reviewService.findById(reviewId);
        res.status(200).json(review);
    }

    async updateReviewById(req: AuthRequest, res: Response, next: NextFunction) {
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
            return res.status(400).json({ message: "User has not purchased this product before" });
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
    }

    async deleteReviewById(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const userId = req.user.id;
        const reviewId = req.params.id;
        const deletedReview = await reviewService.deleteById(reviewId, userId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found." });
        }
        res.status(200).json({ message: "Review deleted successfully." });
    }
}

const reviewController = new ReviewController();
export default reviewController;
