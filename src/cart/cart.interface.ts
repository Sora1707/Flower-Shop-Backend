import { Document, Types } from "mongoose";
import { ICartItem } from "./cartItem.interface";

export interface ICart extends Document {
    user: Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}
