import * as z from "zod";
import { Gender } from "./user.interface";

export const userProfileChangeValidation = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    birthdate: z.coerce.date().optional(),
    gender: z.enum([Gender.Male, Gender.Female, Gender.Other]),
});

export type UserProfileChangeInput = z.infer<typeof userProfileChangeValidation>;

export const userAddressValidation = z.object({
    name: z.string().min(1, { message: "Full name is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    stateOrProvince: z.string().min(1, { message: "State or province is required" }),
    city: z.string().min(1, { message: "City is required" }),
    addressLine1: z.string().min(1, { message: "Address line 1 is required" }),
    addressLine2: z.string().optional(),
    postalCode: z.string().min(1, { message: "Postal code is required" }),
    isDefault: z.boolean().default(false),
});

export type UserAddressInput = z.infer<typeof userAddressValidation>;

export const userAddCardValidation = z.object({
    paymentMethodId: z.string().min(1, { message: "Payment method ID is required" }),
});

export type UserAddCardInput = z.infer<typeof userAddCardValidation>;
