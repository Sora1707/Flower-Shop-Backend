import { NextFunction, Request, Response } from "express";

import userService from "./user.service";
import { processAvatar } from "./avatar";
import { IAddress, IAddressDocument } from "./address.interface";
import {
    UserAddCardInput,
    UserAddressInput,
    UserUpdateAddressInput,
    UserUpdateProfileInput,
} from "./user.validation";
import { getSafeCardInfo, getSafeUser, getSafeUserProfile } from "./util";
import { IStripeCard, IStripeCardDocument, stripeService } from "@/payment/stripe";

import { AuthRequest } from "@/types/request";
import ResponseHandler from "@/utils/ResponseHandler";

class UserController {
    // [GET] /user/me
    async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const safeUser = getSafeUser(req.user);

        ResponseHandler.success(res, safeUser);
    }

    // [GET] /user/:id
    async getUserProfileById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const user = await userService.findById(id);
        if (!user) return ResponseHandler.error(res, "User not found", 404);

        const safeUser = getSafeUserProfile(user);

        ResponseHandler.success(res, safeUser);
    }

    // [GET] /user/profile
    async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const safeUserProfile = getSafeUserProfile(req.user);
        ResponseHandler.success(res, safeUserProfile);
    }

    // [PATCH] /user/profile
    async updateUserProfile(
        req: AuthRequest<{}, {}, UserUpdateProfileInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) return;

        const user = req.user;
        Object.assign(user, req.body);

        await user.save();

        const safeUserProfile = getSafeUserProfile(user);
        ResponseHandler.success(res, safeUserProfile, "Profile updated successfully");
    }

    // [GET] /user/address
    async getUserAddresses(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        ResponseHandler.success(res, req.user.addresses);
    }

    // [POST] /user/address
    async addUserAddress(
        req: AuthRequest<{}, {}, UserAddressInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) return;

        const user = req.user;
        const newAddress = req.body as UserAddressInput;

        user.addresses.push(newAddress as IAddress);

        await user.save();

        ResponseHandler.success(res, user.addresses, "Address added successfully", 201);
    }

    // [PATCH] /user/address/:id/set-default
    async setDefaultAddress(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const user = req.user;
        const addressId = req.params.id;

        const addresses = user.addresses as IAddressDocument[];

        const newDefaultindex = addresses.findIndex((address) => address.id === addressId);
        if (newDefaultindex === -1) return ResponseHandler.error(res, "Address not found", 404);

        const oldDefaultIndex = addresses.findIndex((address) => address.isDefault === true);
        if (oldDefaultIndex === -1) return ResponseHandler.error(res, "No default address", 404);

        addresses[oldDefaultIndex].isDefault = false;
        addresses[newDefaultindex].isDefault = true;
        [addresses[0], addresses[newDefaultindex]] = [addresses[newDefaultindex], addresses[0]];

        await user.save();

        ResponseHandler.success(res, null, "Default address set successfully");
    }

    // [PATCH] /user/address/:id
    async updateUserAddress(
        req: AuthRequest<{ id: string }, {}, UserUpdateAddressInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) return;

        const user = req.user;
        const addressId = req.params.id;
        const addresses = user.addresses as IAddressDocument[];
        const index = addresses.findIndex((address) => address.id === addressId);

        if (index === -1) return ResponseHandler.error(res, "Address not found", 404);

        const address = addresses[index];
        Object.assign(address, req.body);

        await user.save();

        ResponseHandler.success(res, user.addresses, "Address updated successfully");
    }

    // [DELETE] /user/address/:id
    async deleteUserAddress(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const user = req.user;
        const addressId = req.params.id;
        const addresses = user.addresses as IAddressDocument[];

        const index = addresses.findIndex((address) => address.id === addressId);

        if (index === -1) return ResponseHandler.error(res, "Address not found", 404);

        const removedAddress = addresses.splice(index, 1)[0];

        await user.save();

        ResponseHandler.success(res, removedAddress, "Address deleted successfully");
    }

    // [GET] /user/payment
    async getUserPayment(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const user = req.user;
        const safeCards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

        ResponseHandler.success(res, safeCards);
    }

    // [POST] /user/payment
    async addUserPayment(
        req: AuthRequest<{}, {}, UserAddCardInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) return;

        const { paymentMethodId } = req.body;
        const user = req.user;

        await stripeService.attachPaymentMethod(user.stripeCustomerId, paymentMethodId);

        const paymentMethod = await stripeService.getPaymentMethodById(paymentMethodId);
        const card = paymentMethod.card;
        if (!card) return ResponseHandler.error(res, "Card not found", 404);

        const { brand, last4, exp_month, exp_year } = card;

        const newCard = {
            paymentMethodId,
            brand,
            last4,
            exp_month,
            exp_year,
        } as IStripeCard;

        user.cards.push(newCard);

        await user.save();

        const safeCards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

        ResponseHandler.success(res, safeCards, "Card added successfully", 201);
    }

    // [PATCH] /user/payment/:id/set-default
    async setDefaultPayment(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const user = req.user;
        const cardId = req.params.id;

        const cards = user.cards as IStripeCardDocument[];

        const newDefaultindex = cards.findIndex((card) => card.id === cardId);
        if (newDefaultindex === -1) return ResponseHandler.error(res, "Card not found", 404);

        const oldDefaultIndex = cards.findIndex((card) => card.isDefault === true);
        if (oldDefaultIndex === -1) return ResponseHandler.error(res, "No default card", 404);

        cards[oldDefaultIndex].isDefault = false;
        cards[newDefaultindex].isDefault = true;
        [cards[0], cards[newDefaultindex]] = [cards[newDefaultindex], cards[0]];

        await user.save();

        const safeCards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

        ResponseHandler.success(res, safeCards, "Default address set successfully");
    }

    // [DELETE] /user/payment/:id
    async deleteUserPayment(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const user = req.user;
        const cardId = req.params.id;

        const cards = user.cards as IStripeCardDocument[];

        const cardIndex = cards.findIndex((card) => card.id === cardId);

        if (cardIndex === -1) return ResponseHandler.error(res, "Card not found", 404);

        const card = cards.splice(cardIndex, 1)[0];

        await stripeService.detachPaymentMethod(card.paymentMethodId);

        await user.save();

        const safeDeletedCard = getSafeCardInfo([card])[0];

        ResponseHandler.success(res, safeDeletedCard, "Card deleted successfully");
    }

    // [PATCH] /user/avatar
    async updateUserAvatar(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        if (!req.file) return ResponseHandler.error(res, "Avatar is required", 400);

        const user = req.user;
        const file = req.file;

        const avatarPaths = await processAvatar(file, user.id);

        user.avatar = avatarPaths;

        await user.save();

        const safeUser = getSafeUser(user);

        ResponseHandler.success(res, safeUser, "Avatar updated successfully");
    }
}

const userController = new UserController();
export default userController;
