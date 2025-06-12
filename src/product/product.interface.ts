import { Document } from "mongoose";
import { IRating } from "./rating.interface";

export enum Category {
    Bouquet = "bouquet",
    Romantic = "romantic",
    Valentine = "valentine",
    Birthday = "birthday",
    Sympathy = "sympathy",
    Anniversary = "anniversary",
}

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    categories: Category[];
    images: string[];
    stock: number;
    isAvailable: boolean;
    ratings: IRating[];
    createdAt: Date;
    updatedAt: Date;
}
