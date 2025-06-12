import BaseService from "@/services/base.service";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

class UserService extends BaseService<IUser> {
    protected model = UserModel;
}

const userService = new UserService();
export default userService;
