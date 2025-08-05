import { Request, Response, NextFunction } from "express";
import stripeService from "@/payment/stripe/service";
import { userService } from "@/user";
import { stripe } from "@/config/stripe";
import { BASE_URL } from "@/config/dotenv";

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.findOne({ username: "sora" });
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        const amount = 10000;

        const paymentIntent = await stripeService.createPaymentIntent({
            customerId: user.stripeCustomerId,
            paymentMethodId: "pm_1LcE7cKZx4h2Zl9Ql0bZlP4V",
            amount,
            currency: "usd",
        });

        const clientSecret = paymentIntent.client_secret;
        res.status(200).json({ success: true, clientSecret });
    } catch (err) {
        next(err);
    }
}

export async function setupPaymentIntent(req: Request, res: Response, next: NextFunction) {
    const user = await userService.findOne({ username: "sora" });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    const setupIntent = await stripe.setupIntents.create({
        customer: user.stripeCustomerId,
        payment_method_types: ["card"],
    });

    res.json({ clientSecret: setupIntent.client_secret });
}

export async function createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Node.js and Express book",
                    },
                    unit_amount: 50 * 100,
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "JavaScript T-Shirt",
                    },
                    unit_amount: 20 * 100,
                },
                quantity: 2,
            },
        ],
        mode: "payment",
        // shipping_address_collection: {
        //     allowed_countries: ["VN", "US"],
        // },
        success_url: `${BASE_URL}/temp/payment/complete?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${BASE_URL}/temp/payment/cancel`,
    });

    if (session.url) {
        res.status(200).json({ url: session.url });
    } else {
        res.status(500).json({ success: false, message: "Error creating checkout session" });
    }
}
