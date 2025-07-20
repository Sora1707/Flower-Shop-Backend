import nodemailer from "nodemailer";

console.log(process.env.EMAIL_HOST, process.env.EMAIL_PASSWORD);

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD,
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
