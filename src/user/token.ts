import jwt from "jsonwebtoken";

const TOKEN_EXPIRATION = "10m"; // 1 hour

function generateToken(secretKey: string) {
    return function (userId: string) {
        const token = jwt.sign(
            {
                userId,
            },
            secretKey,
            { expiresIn: TOKEN_EXPIRATION }
        );
        return token;
    };
}

export const generateLoginToken = generateToken(process.env.JWT_SECRET!);
export const generatePasswordResetToken = generateToken(process.env.RESET_PASSWORD_SECRET!);

function getPayload<T>(secretKey: string) {
    return function (token: string) {
        const payload = jwt.verify(token, secretKey) as T;
        return payload;
    };
}

export const getLoginPayload = getPayload<{ userId: string }>(process.env.JWT_SECRET!);
export const getPasswordResetPayload = getPayload<{ userId: string }>(
    process.env.RESET_PASSWORD_SECRET!
);
