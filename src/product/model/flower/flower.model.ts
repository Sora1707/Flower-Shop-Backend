import { Schema } from "mongoose";
import { FlowerColor, FlowerType, IFlowerDocument } from "./flower.interface";
import { FlowerTag } from "./flower.interface";
import { ProductModel } from "../product.model";
import { ProductType } from "../product.interface";

const FlowerSchema = new Schema<IFlowerDocument>({
    tags: { type: [{ type: String, enum: FlowerTag }], default: [] },
    colors: { type: [{ type: String, enum: FlowerColor }], default: [] },
    flowerTypes: { type: [{ type: String, enum: FlowerType }], default: [] },
});

export const FlowerModel = ProductModel.discriminator<IFlowerDocument>(
    ProductType.Flower,
    FlowerSchema
);
