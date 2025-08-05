import { IUser } from "./user.interface";
import * as password from "./password";

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

type ModifyPropertyFunction = { [key in keyof Partial<IUser>]: (user: IUser) => any };

const propertyModifiersBeforeSave: ModifyPropertyFunction = {
    addresses: function (user: IUser) {
        modifyDefaultValue(user.addresses);
    },
    password: async function (user: IUser) {
        user.password = await password.hash(user.password);
    },
    cards: async function (user: IUser) {
        modifyDefaultValue(user.cards);
    },
};

export async function modifyPropertiesBeforeSave(user: IUser) {
    const propertyModifiers = Object.keys(propertyModifiersBeforeSave)
        .filter((property) => user.isModified(property))
        .map((property) =>
            (propertyModifiersBeforeSave as { [key: string]: Function })[property](user)
        );

    await Promise.all(propertyModifiers);
}
