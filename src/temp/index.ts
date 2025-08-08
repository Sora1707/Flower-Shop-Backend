import { NextFunction, Request, Response, Router } from "express";
import { reloadSampleData } from "./reload_sample";
import { userService } from "@/user";
import { createCheckoutSession, initiatePayment, setupPaymentIntent } from "./stripe";
import { stripe } from "@/config/stripe";
import { IStripeCard } from "@/payment/stripe";
import asyncHandler from "@/middleware/asyncHandler.middelware";

const router = Router();

router.post("/reload_sample_data", reloadSampleData);

router.post("/pay", initiatePayment);

router.post("/payment/setup-intent", setupPaymentIntent);

router.post("/payment/checkout", createCheckoutSession);

router.get("/payment/success", (req: Request, res: Response) => {
    res.status(200).json({ success: true });
});

router.get("/payment/cancel", (req: Request, res: Response) => {
    res.status(200).json({ success: false });
});

router.post("/payment/save-card", async (req, res) => {
    const paymentMethodId = req.body.paymentMethodId as string;

    if (!paymentMethodId) {
        res.status(400).json({ success: false, message: "Missing paymentMethodId" });
        return;
    }

    const user = await userService.findOne({ username: "sora" });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
    });

    await stripe.customers.update(user.stripeCustomerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const card = paymentMethod.card;
    if (!card) {
        res.status(404).json({ success: false, message: "Card not found" });
        return;
    }
    const { brand, last4, exp_month, exp_year } = card;

    const newCard = {
        paymentMethodId,
        brand,
        last4,
        exp_month,
        exp_year,
        isDefault: false,
    } as IStripeCard;

    user.cards.push(newCard);
    await user.save();

    res.status(200).json({ paymentMethodId });
});

router.post("/payment/change-card", async (req, res) => {
    console.log("here");
    const user = await userService.findOne({ username: "sora" });
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }

    if (user.cards.length === 0) {
        res.status(400).json({ success: false, message: "No cards found" });
        return;
    }
    console.log(user.cards[0]);

    user.cards[1].isDefault = true;

    console.log(user.cards[0]);
    await user.save();
});

router.get("/user/:username", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        const user = await userService.findOne({ username });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

function testError(req: Request, res: Response, next: NextFunction) {
    throw new Error("Test error");
}
router.get("/error", testError);

router.post(
    "/service-test",
    asyncHandler(async (req: Request, res: Response) => {
        const sora = await userService.findOne({ username: "sora" });
        // sora!.phoneNumber = "123456789";
        // await sora!.save();
        res.json({ success: true });
        await userService.updateById(sora!.id, { phoneNumber: "123456789" });
        await userService.updateOne({ username: "sora" }, { phoneNumber: "123456789" });
        await userService.updateMany({ username: "sora" }, { phoneNumber: "123456789" });
    })
);

export default router;
