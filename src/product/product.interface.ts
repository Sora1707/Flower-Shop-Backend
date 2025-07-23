import { Document } from "mongoose";

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
    dailyRuleId: string;
    promotionId?: string[];
    description: string;
    categories: Category[];
    images: string[];
    stock: number;
    isAvailable: boolean;
    rating: {
        average: number;
        count: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
