import path from "path";
import fs from "fs";
import sharp from "sharp";

import { AuthRequest } from "@/types/request";

export const AVATAR_EXTENSION = "jpg";
export const AVATAR_FOLDER_PATH = path.join("src", "uploads", "users");
const AVATAR_DEFAULT_URL = "uploads/defaults/avatar";
export const AVATAR_SIZE = {
    small: 64,
    medium: 128,
    large: 512,
};

export function generateNewAvatarFilename(req: AuthRequest, file: Express.Multer.File): string {
    if (!file || !file.originalname) {
        throw new Error("A file is required");
    }
    if (!req.user) {
        throw new Error("Unauthenticated");
    }
    const userId = req.user.id;
    const ext = path.extname(file.originalname);
    return `${userId}${ext}`;
}

export async function processAvatar(file: Express.Multer.File, userId: string) {
    const filePaths: Record<string, string> = {};

    for (const [label, size] of Object.entries(AVATAR_SIZE)) {
        const filename = `${userId}-${label}.${AVATAR_EXTENSION}`;
        const outputPath = path.join(AVATAR_FOLDER_PATH, filename);

        await sharp(file.path).resize(size, size).toFormat(AVATAR_EXTENSION).toFile(outputPath);

        filePaths[label] = `uploads/users/${filename}`;
    }

    fs.unlinkSync(file.path);

    return filePaths; // return { small: "...", medium: "...", large: "..." }
}

export function getDefaultAvatarPaths() {
    return {
        small: `${AVATAR_DEFAULT_URL}-small.jpg`,
        medium: `${AVATAR_DEFAULT_URL}-medium.jpg`,
        large: `${AVATAR_DEFAULT_URL}-large.jpg`,
    };
}
