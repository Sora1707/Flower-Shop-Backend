import multer, { StorageEngine } from "multer";
import fs from "fs";

import { AuthRequest } from "@/types/request";
import { generateNewAvatarFilename } from "@/utils/upload";

const FOLDER_PATH = "src/uploads/users";

function ensureFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

const storage: StorageEngine = multer.diskStorage({
    destination: (req: AuthRequest, file, cb) => {
        const uploadPath = FOLDER_PATH;

        ensureFolder(uploadPath);

        cb(null, uploadPath);
    },
    filename: (req: AuthRequest, file, cb) => {
        if (!file || !file.originalname) {
            return cb(new Error("File name is required"), "filename-required");
        }
        if (!req.user) {
            return cb(new Error("User ID is required"), "user-id-required");
        }

        const filename = generateNewAvatarFilename(req, file);

        cb(null, filename);
    },
});

export default storage;
