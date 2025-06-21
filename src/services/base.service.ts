import "mongoose-paginate-v2";
import { FilterQuery, Types, Model } from "mongoose";
import { PaginateModel, PaginateOptions } from "mongoose";
import { ClassDef } from "@/types/class";
import { IUser } from "@/user";

type ObjectId = Types.ObjectId;

export type SelectedFieldsObject<T> = Partial<Record<keyof T, 1 | 0>>;
type MongooseSelectedFieldsObject = Record<string, 1 | 0>;

export abstract class BaseService<T> {
    protected abstract model: Model<T>;

    public async findAll(selectFieldsObject: SelectedFieldsObject<T> = {}) {
        const items = await this.model
            .find()
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return items;
    }

    public async findById(id: string, selectFieldsObject: SelectedFieldsObject<T> = {}) {
        const item = await this.model
            .findById(id)
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return item;
    }

    public async findOne(filter: FilterQuery<T>, selectFieldsObject: SelectedFieldsObject<T> = {}) {
        const item = await this.model
            .findOne(filter)
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return item;
    }

    public async findMany(
        filter: FilterQuery<T>,
        selectFieldsObject: SelectedFieldsObject<T> = {}
    ) {
        const items = await this.model
            .find(filter)
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return items;
    }

    public async checkExistsById(id: string) {
        const exists = await this.model.exists({ _id: id });
        return !!exists;
    }

    public async checkExists(filter: FilterQuery<T>) {
        return await this.model.exists(filter);
    }

    public async create(input: Partial<T>) {
        const item = await this.model.create(input);
        return item;
    }

    public async createMany(inputs: Partial<T>[]) {
        const items = await Promise.all(
            inputs.map(async input => {
                return await this.model.create(input);
            })
        );
        return items;
    }

    public async deleteAll() {
        const result = await this.model.deleteMany({});
        return result;
    }

    public async deleteOne(filter: FilterQuery<T>) {
        const result = await this.model.deleteOne(filter);
        return result;
    }

    public async deleteMany(filter: FilterQuery<T>) {
        const result = await this.model.deleteMany(filter);
        return result;
    }

    public async updateMany(filter: Partial<T> & { id?: ObjectId }, input: Partial<T>) {
        const result = await this.model.updateMany(filter, input, { new: true });
        return result;
    }

    public async updateOne(
        filter: Partial<T> & { id?: ObjectId },
        input: Partial<T>,
        selectFieldsObject: SelectedFieldsObject<T> = {}
    ) {
        const item = await this.model
            .findOneAndUpdate(filter, input, { new: true })
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return item;
    }

    public async updateById(
        id: string,
        update: Partial<T>,
        selectFieldsObject: SelectedFieldsObject<T> = {}
    ): Promise<T | null> {
        const item = await this.model
            .findByIdAndUpdate(id, update, { new: true })
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return item;
    }

    public async deleteById(
        id: string,
        selectFieldsObject: SelectedFieldsObject<T> = {}
    ): Promise<T | null> {
        const item = await this.model
            .findByIdAndDelete(id)
            .select(selectFieldsObject as MongooseSelectedFieldsObject);
        return item;
    }
}

export abstract class BasePaginateService<T> extends BaseService<T> {
    protected abstract model: PaginateModel<T>;

    public async paginate(filter: FilterQuery<T>, options: PaginateOptions = {}) {
        const paginateResult = await this.model.paginate(filter, options);
        return paginateResult;
    }
}
