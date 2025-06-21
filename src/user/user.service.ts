import { BasePaginateService } from "@/services";
import { IUser } from "./user.interface";
import { UserModel } from "./user.model";

class UserService extends BasePaginateService<IUser> {
    protected model = UserModel;
}

const userService = new UserService();
export default userService;
