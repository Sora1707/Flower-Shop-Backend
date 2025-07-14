import { NextFunction, Request, Response, Router } from "express";
import { userUpload } from "@/config/upload";

const router = Router();

router.post(
    "/avatar/:id",
    userUpload.single("avatar"),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file; // typed as Express.Multer.File
            const filePath = `/uploads/users/${file?.filename}`;
            res.json({ imagePath: filePath });
        } catch (error) {}
    }
);

export default router;
