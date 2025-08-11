import { Schema } from "mongoose";
import { IVaseDocument } from "./vase.interface";
import { ProductModel } from "../product.model";
import { ProductType } from "../product.interface";

const VaseSchema = new Schema<IVaseDocument>({});

export const VaseModel = ProductModel.discriminator<IVaseDocument>(ProductType.Vase, VaseSchema);
