import "mongoose-paginate-v2";
import { FilterQuery, Types, Model } from "mongoose";
import { PaginateModel, PaginateOptions } from "mongoose";

type ObjectId = Types.ObjectId;

export type SelectedFieldsObject<T> = Partial<Record<keyof T, 1 | 0>>;
type MongooseSelectedFieldsObject = Record<string, 1 | 0>;

export abstract class BaseService<T> {
    protected abstract model: Model<T>;

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
            inputs.map(async (input) => {
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

    public async updateMany(filter: Partial<T> & { id?: ObjectId }, update: Partial<T>) {
        // ! TEMPORARILY DEPRECATED
        // const result = await this.model.updateMany(filter, update, { new: true });

        const items = await this.model.find(filter);
        const updatedItems = await Promise.all(
            items.map((item) => {
                item.set(update);
                return item.save() as T;
            })
        );

        return updatedItems;
    }

    public async updateOne(filter: Partial<T> & { id?: ObjectId }, update: Partial<T>) {
        // ! TEMPORARILY DEPRECATED
        // const item = await this.model.updateOne(filter, input, { new: true });
        const item = await this.model.findOne(filter);
        if (!item) return null;
        item.set(update);
        const updatedItem = (await item.save()) as T;
        return updatedItem;
    }

    public async updateById(id: string, update: Partial<T>) {
        // ! TEMPORARILY DEPRECATED
        // const item = await this.model.findByIdAndUpdate(id, update, { new: true });

        const item = await this.model.findById(id);
        if (!item) return null;
        item.set(update);
        const updatedItem = (await item.save()) as T;
        return updatedItem;
    }

    public async deleteById(id: string): Promise<T | null> {
        const item = await this.model.findByIdAndDelete(id);

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
