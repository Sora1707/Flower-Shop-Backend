import { IUser, IUserDocument } from "./user.interface";

import { getDefaultAvatarPaths } from "./avatar";
import { IStripeCard } from "@/payment/stripe";
import { IStripeCardDocument } from "@/payment/stripe/StripeCard.interface";

type UserProperty = keyof IUser;
type SafeCard = Omit<IStripeCard, "paymentMethodId">;
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
    const safeUser: SafeUser = user.toObject<IUser>();

    safeUser.avatar = getUserAvatar(safeUser);

    safeUserExcludedFields.forEach((field) => delete safeUser[field]);

    safeUser.cards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

    return safeUser;
}

export function getSafeUserProfile(user: IUserDocument) {
    const safeUser: SafeUser = user.toObject();

    safeUserProfileExcludedFields.forEach((field) => delete safeUser[field]);

    return safeUser;
}

export function getSafeCardInfo(cards: IStripeCardDocument[]) {
    const safeCards = cards.map((card) => {
        const { paymentMethodId, ...safeCard } = card.toObject();
        return safeCard as SafeCard;
    });
    return safeCards;
}
