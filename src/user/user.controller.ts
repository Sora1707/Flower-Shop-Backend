import { NextFunction, Request, Response } from "express";

import userService from "./user.service";
import { processAvatar } from "./avatar";
import { IAddress } from "./address.interface";
import { UserAddCardInput, UserAddressInput } from "./user.validation";
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
        if (!user) return res.status(404).json({ message: "User not found." });

        ResponseHandler.success(res, user);
    }

    // [GET] /user/profile
    async getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;

        const safeUserProfile = getSafeUserProfile(req.user);
        ResponseHandler.success(res, safeUserProfile);
    }

    // [PATCH] /user/profile
    async updateUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) return;
    }

    async getUserAddresses(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }
        const safeUser = getSafeUser(req.user);
        ResponseHandler.success(res, safeUser.addresses);
    }

    // [POST] /user/address
    async addUserAddress(
        req: AuthRequest<{}, {}, UserAddressInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const newAddress = req.body as UserAddressInput;

        user.addresses.push(newAddress as IAddress);

        await user.save();

        ResponseHandler.success(res, null, "Address added successfully", 201);
    }

    // [PATCH] /user/address/:id/default
    async setDefaultAddress(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const addressId = req.params.id;

        const index = user.addresses.findIndex((address) => address.id === addressId);
        user.addresses.forEach((address) => (address.isDefault = false));
        user.addresses[index].isDefault = true;
        [user.addresses[0], user.addresses[index]] = [user.addresses[index], user.addresses[0]];

        await user.save();

        ResponseHandler.success(res, null, "Default address set successfully");
    }

    // [PATCH] /user/address/:id
    // [PUT] /user/address/:id
    async updateUserAddress(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const addressId = req.params.id;
        const index = user.addresses.findIndex((address) => address.id === addressId);

        if (index === -1) {
            ResponseHandler.error(res, "Address not found", 404);
        }

        if (req.body.isDefault !== undefined) {
            delete req.body.isDefault;
        }

        const address = user.addresses[index];
        Object.assign(address, req.body);

        await user.save();

        ResponseHandler.success(res, { addresses: user.addresses }, "Address updated successfully");
    }

    // [DELETE] /user/address/:id
    async deleteUserAddress(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const addressId = req.params.id;

        const addressIndex = user.addresses.findIndex((address) => address.id === addressId);

        if (addressIndex === -1) {
            ResponseHandler.error(res, "Address not found", 404);
        }

        const removedAddress = user.addresses.splice(addressIndex, 1)[0];

        await user.save();

        ResponseHandler.success(res, { addresses: removedAddress }, "Address deleted successfully");
    }

    // [GET] /user/payment
    async getUserPayment(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const safeCards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

        ResponseHandler.success(res, { cards: safeCards });
    }

    // [POST] /user/payment
    async addUserPayment(
        req: AuthRequest<{}, {}, UserAddCardInput>,
        res: Response,
        next: NextFunction
    ) {
        if (!req.user) {
            return;
        }

        const { paymentMethodId } = req.body;
        const user = req.user;

        await stripeService.attachPaymentMethod(user.stripeCustomerId, paymentMethodId);

        const paymentMethod = await stripeService.getPaymentMethodById(paymentMethodId);

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

        const safeCards = getSafeCardInfo(user.cards as IStripeCardDocument[]);

        ResponseHandler.success(res, safeCards, "Card added successfully", 201);
    }

    // [DELETE] /user/payment/:id
    async deleteUserPayment(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return;
        }

        const user = req.user;
        const cardId = req.params.id;

        const cards = user.cards as IStripeCardDocument[];

        const cardIndex = cards.findIndex((card) => card._id === cardId);

        if (cardIndex === -1) {
            ResponseHandler.error(res, "Card not found", 404);
            return;
        }

        const card = cards.splice(cardIndex, 1)[0];

        await stripeService.detachPaymentMethod(card.paymentMethodId);

        await user.save();

        ResponseHandler.success(res, null, "Card deleted successfully");
    }

    // [PUT] /me
    // [PATCH] /me
    async updateCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const updatedUserData = req.body;

        delete updatedUserData.password;
        delete updatedUserData.role;

        if (req.file) {
            const avatarPaths = await processAvatar(req.file, req.user.id);
            updatedUserData.avatar = avatarPaths;
        }

        const updatedUser = await userService.updateById(req.user.id, updatedUserData);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const safeUser = getSafeUser(updatedUser);

        ResponseHandler.success(res, safeUser, "User updated successfully");
    }

    // [DELETE] /me
    async deleteCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
        const id = req.user?._id;
        const deleteUser = await userService.deleteById(id as string);

        if (!deleteUser) {
            return res.status(404).json({ message: "User not found." });
        }

        ResponseHandler.success(res, null, "User deleted successfully");
    }

    // TODO
    async setDefaultPayment(req: AuthRequest, res: Response, next: NextFunction) {}
}

const userController = new UserController();
export default userController;
