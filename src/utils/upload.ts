import path from "path";

import { AuthRequest } from "@/types/request";

export function generateNewAvatarFilename(req: AuthRequest, file: Express.Multer.File): string {
    if (!file || !file.originalname) {
        throw new Error("A file is required");
    }
    if (!req.user) {
        throw new Error("Unauthenticated");
    }
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    return `${userId}-${timestamp}${ext}`;
}
