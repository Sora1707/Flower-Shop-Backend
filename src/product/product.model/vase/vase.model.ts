import { Schema } from "mongoose";
import { IVaseDocument } from "./vase.interface";
import { ProductModel } from "../product.model";

const VaseSchema = new Schema<IVaseDocument>({});

export const VaseModel = ProductModel.discriminator<IVaseDocument>("vase", VaseSchema);
