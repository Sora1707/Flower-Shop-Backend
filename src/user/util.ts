import { DEFAULT_AVATAR_PATH } from "@/config/url";
import { IUser } from "./user.interface";
import { get } from "http";

export function getDefaultAvatarPaths(user: IUser) {
    return user.avatar;
}

export function getSafeUser(user: IUser) {
    const safeUser: Partial<IUser> = { ...user };
    delete safeUser.password;
    delete safeUser.role;
    safeUser.avatar = user.avatar || getDefaultAvatarPaths(user);
    return safeUser;
}
