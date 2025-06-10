import { BaseService } from "@/services/base.service";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

class UserService extends BaseService<IUser> {
    constructor() {
        super(UserModel);
    }
}

export const userService = new UserService();
