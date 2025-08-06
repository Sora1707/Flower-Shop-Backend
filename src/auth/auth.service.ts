import jwt, { JwtPayload } from "jsonwebtoken";
import { StringValue } from "ms";
import { IUser } from "@/user";

import { JWT_SECRET, RESET_PASSWORD_SECRET } from "@/config/dotenv";

type AuthConfig = {
    loginSecretKey: string;
    resetPasswordSecretKey: string;
    loginExpirationTime: StringValue | number;
    resetPasswordExpirationTime: StringValue | number;
};

class AuthService {
    private loginSecretKey: string;
    private resetPasswordSecretKey: string;
    private loginExpirationTime: StringValue | number;
    private resetPasswordExpirationTime: StringValue | number;

    public generateLoginToken: (userId: string) => string;
    public generatePasswordResetToken: (userId: string) => string;

    public getLoginPayload: (token: string) => JwtPayload & { userId: string };
    public getPasswordResetPayload: (token: string) => JwtPayload & { userId: string };

    constructor(config: AuthConfig) {
        this.loginSecretKey = config.loginSecretKey;
        this.resetPasswordSecretKey = config.resetPasswordSecretKey;
        this.loginExpirationTime = config.loginExpirationTime;
        this.resetPasswordExpirationTime = config.resetPasswordExpirationTime;

        this.generateLoginToken = this.generateToken(this.loginSecretKey, this.loginExpirationTime);
        this.generatePasswordResetToken = this.generateToken(
            this.resetPasswordSecretKey,
            this.resetPasswordExpirationTime
        );

        this.getLoginPayload = this.getPayload<JwtPayload & { userId: string }>(JWT_SECRET!);
        this.getPasswordResetPayload = this.getPayload<JwtPayload & { userId: string }>(
            RESET_PASSWORD_SECRET!
        );
    }

    private generateToken(secretKey: string, expiration: StringValue | number) {
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

    private getPayload<T>(secretKey: string) {
        return function (token: string) {
            const payload = jwt.verify(token, secretKey) as T;
            return payload;
        };
    }

    public checkPayloadBeforePasswordReset(payload: JwtPayload, user: IUser) {
        if (!(typeof payload.iat === "number")) return true;
        const requestIssuedAt = payload.iat * 1000;
        const passwordChangedAt = user.passwordChangedAt.getTime();
        return requestIssuedAt <= passwordChangedAt;
    }
}

const authService = new AuthService({
    loginSecretKey: JWT_SECRET!,
    resetPasswordSecretKey: RESET_PASSWORD_SECRET!,
    loginExpirationTime: "1h",
    resetPasswordExpirationTime: "15m",
});
export default authService;
