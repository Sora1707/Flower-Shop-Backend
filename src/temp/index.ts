import { NextFunction, Request, Response, Router } from "express";
import { reloadSampleData } from "./reload_sample";
import { userService } from "@/user";

const router = Router();

router.post("/reload_sample_data", reloadSampleData);

router.get("/user/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        const user = await userService.findOne({ username });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
