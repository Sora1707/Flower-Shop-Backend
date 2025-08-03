import { RoyaltyPointModel } from "./royalty.model";
import { IRoyaltyPoint } from "./royalty.interface";
import mongoose from "mongoose";

export const royaltyService = {
    create: async (data: IRoyaltyPoint) => {
        return RoyaltyPointModel.create(data);
    },

    getUserPoints: async (userId: string) => {
        const result = await RoyaltyPointModel.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: "$user", total: { $sum: "$points" } } },
        ]);

        return result[0]?.total || 0;
    },

    getHistory: async (userId: string) => {
        return RoyaltyPointModel.find({ user: userId }).sort({ createdAt: -1 });
    },
};
