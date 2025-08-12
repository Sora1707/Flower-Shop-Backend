import { Document } from "mongoose";
import { IProduct } from "../product.interface";

export interface IVase extends IProduct {}

export interface IVaseDocument extends IVase, Document {}
