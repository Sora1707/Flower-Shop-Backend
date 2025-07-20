import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";

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

export const generateLoginToken = generateToken(process.env.JWT_SECRET!, LOGIN_EXPIRATION);
export const generatePasswordResetToken = generateToken(
    process.env.RESET_PASSWORD_SECRET!,
    RESET_PASSWORD_EXPIRATION
);

function getPayload<T>(secretKey: string) {
    return function (token: string) {
        const payload = jwt.verify(token, secretKey) as T;
        return payload;
    };
}

export const getLoginPayload = getPayload<JwtPayload & { userId: string }>(process.env.JWT_SECRET!);
export const getPasswordResetPayload = getPayload<JwtPayload & { userId: string }>(
    process.env.RESET_PASSWORD_SECRET!
);
