import { BasePaginateService, SelectedFieldsObject } from "@/services";
import { IUserDocument } from "./user.interface";
import { UserModel } from "./user.model";
class UserService extends BasePaginateService<IUserDocument> {
    protected model = UserModel;
}

const userService = new UserService();
export default userService;
