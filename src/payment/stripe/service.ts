import { stripe } from "@/config/stripe";
import { IUser } from "@/user";

class StripeService {
    async createNewCustomer(user: IUser) {
        const customer = await stripe.customers.create({
            name: user.username,
            email: user.email,
        });
        return customer;
    }

    async getCustomerById(customerId: string) {
        const customer = await stripe.customers.retrieve(customerId);
        return customer;
    }

    async getCustomerPaymentMethods(customerId: string) {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        return paymentMethods;
    }

    async getPaymentMethodById(paymentMethodId: string) {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        return paymentMethod;
    }

    async attachPaymentMethod(customerId: string, paymentMethodId: string) {
        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });
        return paymentMethod;
    }

    async detachPaymentMethod(paymentMethodId: string) {
        const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
        return paymentMethod;
    }

    async getAllSavedCards(customerId: string) {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: "card",
        });
        return paymentMethods.data;
    }

    async setDefaultCard(customerId: string, paymentMethodId: string) {
        const updatedCustomer = await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return updatedCustomer;
    }

    async getDefaultCard(customerId: string) {
        const customer = await stripe.customers.retrieve(customerId);

        if (customer.deleted === true) {
            throw new Error("Customer has been deleted");
        }

        return customer.invoice_settings.default_payment_method;
    }

    async createPaymentIntent({
        customerId,
        paymentMethodId,
        amount, // in cents (e.g., $10 = 1000)
        currency,
    }: {
        customerId: string;
        paymentMethodId: string;
        amount: number;
        currency: string;
    }) {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never", // This line prevents the need for `return_url`
            },
        });

        return paymentIntent;
    }
}

const stripeService = new StripeService();
export default stripeService;
