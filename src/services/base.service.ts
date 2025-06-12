import { FilterQuery, Types, Model } from "mongoose";
import { ClassDef } from "@/types/class";

export type ObjectId = Types.ObjectId;

export abstract class BaseService<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    public async findAll() {
        const items = await this.model.find();
        return items;
    }

    public async findById(id: string) {
        const item = await this.model.findById(id);
        return item;
    }

    public async findOne(filter: FilterQuery<T>) {
        const item = await this.model.findOne(filter);
        return item;
    }

    public async findMany(filter: FilterQuery<T>) {
        const items = await this.model.find(filter);
        return items;
    }

    public async create(input: Partial<T>) {
        const item = await this.model.create(input);
        return item;
    }

    public async createMany(inputs: Partial<T>[]) {
        const items = await this.model.insertMany(inputs);
        return items;
    }

    public async deleteAll() {
        const result = await this.model.deleteMany({});
        return result;
    }

    public async deleteMany(filter: Partial<T> & { id: ObjectId }) {
        const result = await this.model.deleteMany(filter);
        return result;
    }

    public async updateMany(filter: Partial<T> & { id: ObjectId }, input: Partial<T>) {
        const result = await this.model.updateMany(filter, input, { new: true });
        return result;
    }

    public async updateById(id: string, update: Partial<T>): Promise<T | null> {
        const item = await this.model.findByIdAndUpdate(id, update, { new: true });
        return item;
    }

    public async deleteById(id: string): Promise<T | null> {
        const item = await this.model.findByIdAndDelete(id);
        return item;
    }
}
