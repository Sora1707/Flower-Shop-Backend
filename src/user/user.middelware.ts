import { IUser } from "./user.interface";
import * as password from "./password";
import { stripeService } from "@/payment/stripe";
import { cartService } from "@/cart";

function modifyDefaultValue<T extends { isDefault: boolean }>(elements: T[]) {
    if (elements.length == 0) return;
    let hasDefault = false;
    for (const element of elements) {
        if (element.isDefault) {
            hasDefault = true;
            break;
        }
    }
    if (!hasDefault) {
        elements[0].isDefault = true;
    }
}

type ModifyPropertyFunctions = { [key in keyof Partial<IUser>]: (user: IUser) => Promise<void> };

const propertyModifiersBeforeSave: ModifyPropertyFunctions = {
    addresses: async function (user: IUser) {
        modifyDefaultValue(user.addresses);
    },
    password: async function (user: IUser) {
        user.password = await password.hash(user.password);
    },
    cards: async function (user: IUser) {
        modifyDefaultValue(user.cards);
    },
};

export function getBeforeSavePropertyModifiers(user: IUser) {
    const propertyModifiers = Object.entries(propertyModifiersBeforeSave)
        .filter(([property, _]) => user.isModified(property))
        .map(([_, modifier]) => modifier(user));

    return propertyModifiers;
}

type InitializerFunctions = { [key: string]: (user: IUser) => Promise<void> };

const initializers: InitializerFunctions = {
    stripe: async function (user: IUser) {
        const customer = await stripeService.createNewCustomer(user);
        user.stripeCustomerId = customer.id;
    },
    cart: async function (user: IUser) {
        await cartService.create({
            user: user.id,
            items: [],
        });
    },
};

export function getInitializers(user: IUser) {
    return Object.values(initializers).map((initializer) => initializer(user));
}
