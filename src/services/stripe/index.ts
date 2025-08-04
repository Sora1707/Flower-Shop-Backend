import { stripe } from "@/config/stripe";
import { IUser } from "@/user";

export async function createNewCustomer(user: IUser) {
    const customer = await stripe.customers.create({
        name: user.username,
        email: user.email,
    });
    return customer;
}

export async function getCustomerById(customerId: string) {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
}

export async function getPaymentMethods(customerId: string) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });
    return paymentMethods;
}

export async function attachPaymentMethod(customerId: string, paymentMethodId: string) {
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    });
    return paymentMethod;
}

export async function detechPaymentMethod(paymentMethodId: string) {
    const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
    return paymentMethod;
}

export async function getAllSavedCards(customerId: string) {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });
    return paymentMethods.data;
}

export async function setDefaultCard(customerId: string, paymentMethodId: string) {
    const updatedCustomer = await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });

    return updatedCustomer;
}

export async function getDefaultCard(customerId: string) {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted === true) {
        throw new Error("Customer has been deleted");
    }

    return customer.invoice_settings.default_payment_method;
}

export async function chargeCustomer({
    customerId,
    paymentMethodId,
    amount, // in cents (e.g., $10 = 1000)
    currency = "usd",
}: {
    customerId: string;
    paymentMethodId: string;
    amount: number;
    currency?: string;
}) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        payment_method: paymentMethodId,
        confirm: true,
        off_session: true,
    });

    return paymentIntent;
}
