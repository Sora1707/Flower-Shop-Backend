import multer, { StorageEngine } from "multer";
import fs from "fs";

const FOLDER_PATH = "src/uploads/products";

function ensureFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = FOLDER_PATH;

        ensureFolder(uploadPath);

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    },
});

export default storage;
