import { Types } from "mongoose";

export interface IRating {
    user: Types.ObjectId;
    score: number;
    updatedAt: Date;
    createdAt: Date;
}
