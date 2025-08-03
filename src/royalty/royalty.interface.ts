import { Types } from "mongoose";

export enum RoyaltyPointAction {
    EARNED = "EARNED",
    SPENT = "SPENT",
    ADJUSTED = "ADJUSTED", // Optional manual changes
}

export interface IRoyaltyPoint {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    points: number;
    type: RoyaltyPointAction;
    description?: string;
    orderId?: Types.ObjectId;
    createdAt?: Date;
}
