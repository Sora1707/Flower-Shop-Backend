import { NextFunction, Request, Response } from "express";

import ResponseHandler from "@/utils/ResponseHandler";
import { reviewService } from "@/review";
import { userService } from "@/user";
import { productService } from "@/product";

class AdminReviewController {
    // TODO: Filter reviews
    // [GET] /admin/review
    async getReviews(req: Request, res: Response, next: NextFunction) {
        const {} = req.query;

        const reviews = await reviewService.findMany({});

        ResponseHandler.success(res, reviews, "Reviews found");
    }

    // [GET] /admin/review/:reviewId
    async getReviewById(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;

        const review = await reviewService.findById(reviewId);
        if (!review) return ResponseHandler.error(res, "Review not found.", 404);

        ResponseHandler.success(res, review, "Review found");
    }

    // [DELETE] /admin/review/:reviewId
    async deleteReviewById(req: Request, res: Response, next: NextFunction) {
        const { reviewId } = req.params;

        const deletedReview = await reviewService.deleteById(reviewId);
        if (!deletedReview) return ResponseHandler.error(res, "Review not found.", 404);

        ResponseHandler.success(res, null, "Review deleted successfully");
    }

    // [GET] /admin/review/product/:productId
    async getReviewsForProduct(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.params;

        const product = await productService.findById(productId);
        if (!product) return ResponseHandler.error(res, "Product not found.", 404);

        const reviews = await reviewService.findMany({ product: productId });

        ResponseHandler.success(res, reviews, "Reviews found");
    }

    // [GET] /admin/review/user/:userId/:productId
    async getUserReviewForProduct(req: Request, res: Response, next: NextFunction) {
        const { userId, productId } = req.params;

        const user = await userService.findById(userId);
        if (!user) return ResponseHandler.error(res, "User not found.", 404);

        const product = await productService.findById(productId);
        if (!product) return ResponseHandler.error(res, "Product not found.", 404);

        const review = await reviewService.findOne({ user: userId, product: productId });

        ResponseHandler.success(res, review, "Review found");
    }

    async getUserReviews(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.params;

        const user = await userService.findById(userId);
        if (!user) return ResponseHandler.error(res, "User not found.", 404);

        const reviews = await reviewService.findMany({ user: userId });

        ResponseHandler.success(res, reviews, "Reviews found");
    }
}

export default new AdminReviewController();
