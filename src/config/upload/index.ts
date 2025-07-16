import multer from "multer";

import userStorage from "./userStorage";
import productStorage from "./productStorage";

export const uploadAvatar = multer({ storage: userStorage });
// export const productUpload = multer({ storage: productStorage });
