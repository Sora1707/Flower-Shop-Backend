import { Types } from "mongoose";

export interface IReview extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
