import { DEFAULT_AVATAR_PATH } from "@/config/url";
import { IUser } from "./user.interface";

export function getSafeUser(user: IUser) {
    const safeUser: Partial<IUser> = { ...user };
    delete safeUser.password;
    delete safeUser.role;
    safeUser.avatar = user.avatar || DEFAULT_AVATAR_PATH;
    return safeUser;
}
