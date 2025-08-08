import { BasePaginateService } from "@/services";

import { IOrder, IOrderDocument, OrderStatus } from "./order.interface";
import { OrderModel } from "./order.model";

class OrderService extends BasePaginateService<IOrderDocument> {
    protected model = OrderModel;

    public async checkUserHasPurchasedProduct(userId: string, productId: string) {
        const exists = await this.model.exists({
            user: userId,
            "items.product": productId,
            status: OrderStatus.Completed,
        });
        return !!exists;
    }
}

const orderService = new OrderService();
export default orderService;
