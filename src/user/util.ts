import { IUser, IUserDocument } from "./user.interface";

import { getDefaultAvatarPaths } from "./avatar";
import { IStripeCard } from "@/payment/stripe";

type UserProperty = keyof IUser;
type SafeCard = Partial<Omit<IStripeCard, "paymentMethodId">>;
type SafeUser = Partial<Omit<IUser, "cards"> & { cards: SafeCard[] }>;

const addressFields: UserProperty[] = ["addresses"];
const cardFields: UserProperty[] = ["cards", "stripeCustomerId"];
const safeUserExcludedFields: UserProperty[] = [
    "password",
    "role",
    "updatedAt",
    "passwordChangedAt",
];
const safeUserProfileExcludedFields: UserProperty[] = [
    ...safeUserExcludedFields,
    ...addressFields,
    ...cardFields,
];

function getUserAvatar(user: SafeUser) {
    return user.avatar || getDefaultAvatarPaths();
}

export function getSafeUser(user: IUserDocument) {
    const safeUser = user.toObject<IUser>();

    safeUser.avatar = getUserAvatar(safeUser);

    safeUserExcludedFields.forEach((field) => delete safeUser[field]);

    safeUser.cards = getSafeCardInfo(user.cards);

    return safeUser;
}

export function getSafeUserProfile(user: IUserDocument) {
    const safeUser: SafeUser = user.toObject();

    safeUserProfileExcludedFields.forEach((field) => delete safeUser[field]);

    return safeUser;
}

export function getSafeCardInfo(cards: IStripeCard[]) {
    const safeCards = cards.map((card) => {
        const { paymentMethodId, ...safeCard } = card.toObject();
        return safeCard;
    });
    return safeCards;
}
