import { Document } from "mongoose";
import { IProduct } from "../product.interface";

export enum FlowerTag {
    Romantic = "romantic",
    Valentine = "valentine",
    Birthday = "birthday",
    Sympathy = "sympathy",
    Anniversary = "anniversary",
}

export enum FlowerColor {
    Red = "red",
    White = "white",
    Pink = "pink",
    Purple = "purple",
    Black = "black",
    Green = "green",
    Blue = "blue",
    Orange = "orange",
    Yellow = "yellow",
    Brown = "brown",
}

export enum FlowerType {
    Rose = "rose",
    Lily = "lily",
    Tulip = "tulip",
    Peony = "peony",
}

export interface IFlower extends IProduct {
    tags: FlowerTag[];
    colors: FlowerColor[];
    flowerTypes: FlowerType[];
}

export interface IFlowerDocument extends IFlower, Document {}
