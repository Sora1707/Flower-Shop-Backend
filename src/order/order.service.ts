import { BaseService } from "@/services/base.service";
import { IOrder } from "./order.interface";
import { OrderModel } from "./order.model";

class OrderService extends BaseService<IOrder> {
    protected model = OrderModel;
}

const orderService = new OrderService();
export default orderService;
