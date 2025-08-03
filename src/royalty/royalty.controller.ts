import { Request, Response, NextFunction } from "express";
import { royaltyService } from "./royalty.service";
import ResponseHandler from "@/utils/ResponseHandler";

class RoyaltyController {
    async getUserTotal(req: Request, res: Response, next: NextFunction) {
            try {
                const { userId } = req.params;
                const total = await royaltyService.getUserPoints(userId);
                res.status(200).json({ userId, totalPoints: total });
                ResponseHandler.success(res, { userId, totalPoints: total }, "Get user's point successfully", 200);
            } catch (error) {
                next(error);
            }
    }

    async getUserHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const history = await royaltyService.getHistory(userId);
            ResponseHandler.success(res, { history }, "Get user's royal point history successfully", 200);
        } catch (error) {
            next(error);
        }
    }
}

export const royaltyController = new RoyaltyController();
