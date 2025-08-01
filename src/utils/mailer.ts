import nodemailer from "nodemailer";

import { EMAIL_HOST, EMAIL_PASSWORD } from "@/config/dotenv";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_HOST,
        pass: EMAIL_PASSWORD,
    },
});

export async function sendResetPasswordEmail(to: string, link: string) {
    await transporter.sendMail({
        from: '"Flower Shop" <no-reply@flowershop.com>',
        to,
        subject: "Reset Your Password",
        html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${link}">Click here to reset your password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
    });
}
