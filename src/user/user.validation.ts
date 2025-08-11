import * as z from "zod";
import { Gender } from "./user.interface";

export const userUpdateProfileValidation = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthdate: z.coerce.date().optional(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other]).optional(),
});

export type UserUpdateProfileInput = z.infer<typeof userUpdateProfileValidation>;

export const userAddressValidation = z.object({
    name: z.string().min(1, { message: "Full name is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    stateOrProvince: z.string().min(1, { message: "State or province is required" }),
    city: z.string().min(1, { message: "City is required" }),
    addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
    addressLine2: z.string().optional(),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
});

export type UserAddressInput = z.infer<typeof userAddressValidation>;

export const userUpdateAddressValidation = z.object({
    name: z.string().min(1).optional(),
    phoneNumber: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    stateOrProvince: z.string().min(1).optional(),
    city: z.string().min(1).optional(),
    addressLine1: z.string().min(1).optional(),
    addressLine2: z.string().optional().optional(),
    postalCode: z.string().min(1).optional(),
});

export type UserUpdateAddressInput = z.infer<typeof userUpdateAddressValidation>;

export const userAddCardValidation = z.object({
    paymentMethodId: z.string().min(1, { message: "Payment method ID is required" }),
});

export type UserAddCardInput = z.infer<typeof userAddCardValidation>;
