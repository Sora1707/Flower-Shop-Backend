import { Types } from "mongoose";

export interface IReview {
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    // TODO: review image
    // images: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewDocument extends IReview, Document {}
