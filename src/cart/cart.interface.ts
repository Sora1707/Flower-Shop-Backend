import { Document, Types } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export interface ICart {
    user: Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ICartDocument extends ICart, Document {}
