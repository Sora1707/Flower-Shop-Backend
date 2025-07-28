import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";

import { JWT_SECRET, RESET_PASSWORD_SECRET } from "@/config/dotenv";

import { IUser } from "./user.interface";

const LOGIN_EXPIRATION = "10m";
const RESET_PASSWORD_EXPIRATION = "15m";

function generateToken(secretKey: string, expiration: StringValue | number) {
    return function (userId: string) {
        const token = jwt.sign(
            {
                userId,
            },
            secretKey,
            { expiresIn: expiration }
        );
        return token;
    };
}

export const generateLoginToken = generateToken(JWT_SECRET!, LOGIN_EXPIRATION);
export const generatePasswordResetToken = generateToken(
    RESET_PASSWORD_SECRET!,
    RESET_PASSWORD_EXPIRATION
);

function getPayload<T>(secretKey: string) {
    return function (token: string) {
        const payload = jwt.verify(token, secretKey) as T;
        return payload;
    };
}

export const getLoginPayload = getPayload<JwtPayload & { userId: string }>(JWT_SECRET!);
export const getPasswordResetPayload = getPayload<JwtPayload & { userId: string }>(
    RESET_PASSWORD_SECRET!
);

export function checkPayloadBeforePasswordReset(payload: JwtPayload, user: IUser) {
    if (!(typeof payload.iat === "number")) return true;
    const requestIssuedAt = payload.iat * 1000;
    const passwordChangedAt = user.passwordChangedAt.getTime();
    return requestIssuedAt <= passwordChangedAt;
}
