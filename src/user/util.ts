import { IUser } from "./user.interface";

import { getDefaultAvatarPaths } from "./avatar";

export function getSafeUser(user: IUser) {
    const safeUser: Partial<IUser> = { ...user };
    delete safeUser.password;
    delete safeUser.role;
    safeUser.avatar = user.avatar || getDefaultAvatarPaths();
    return safeUser;
}
