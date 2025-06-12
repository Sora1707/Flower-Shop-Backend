import { Document } from "mongoose";

export enum Category {
    Bouquet = "bouquet",
    Romantic = "romantic",
    Valentine = "valentine",
    Birthday = "birthday",
    Sympathy = "sympathy",
    Anniversary = "anniversary",
}

export interface IRating {
    userId: string;
    score: number;
    updatedAt: Date;
    createdAt: Date;
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
