import { BasePaginateService } from "@/services";

import { ReviewModel } from "./review.model";
import { IReview } from "./review.interface";

class ReviewService extends BasePaginateService<IReview> {
    protected model = ReviewModel;
}

const reviewService = new ReviewService();
export default reviewService;
