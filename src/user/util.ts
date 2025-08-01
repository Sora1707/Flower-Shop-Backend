import { IUser } from "./user.interface";

import { getDefaultAvatarPaths } from "./avatar";

type UserProperty = keyof IUser;
const safeUserExcludedFields: UserProperty[] = ["password", "role", "updatedAt"];

const safeUserProfileExcludedFields: UserProperty[] = [...safeUserExcludedFields, "addresses"];

function getUserAvatar(user: Partial<IUser>) {
    return user.avatar || getDefaultAvatarPaths();
}

export function getSafeUser(user: IUser) {
    const safeUser: Partial<IUser> = { ...user };

    safeUser.avatar = getUserAvatar(safeUser);

    safeUserExcludedFields.forEach(field => delete safeUser[field]);

    return safeUser;
}

export function getSafeUserProfile(user: IUser) {
    const safeUser: Partial<IUser> = { ...user };

    safeUserProfileExcludedFields.forEach(field => delete safeUser[field]);

    return safeUser;
}
