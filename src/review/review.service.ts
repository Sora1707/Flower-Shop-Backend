import { BasePaginateService } from "@/services";

import { ReviewModel } from "./review.model";
import { IReview, IReviewDocument } from "./review.interface";

class ReviewService extends BasePaginateService<IReviewDocument> {
    protected model = ReviewModel;
}

const reviewService = new ReviewService();
export default reviewService;
