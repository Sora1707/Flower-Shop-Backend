import { Document, Types } from "mongoose";

export enum ProductType {
    Flower = "flower",
    Vase = "vase",
}

export interface IProduct {
    name: string;
    type: ProductType;
    price: number;
    description: string;

    dailyRule: Types.ObjectId;
    promotions: Types.ObjectId[];

    // TODO: Product images
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

export interface IProductDocument extends IProduct, Document {}
