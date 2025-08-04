import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { PaginateModel, Schema } from "mongoose";
import { OrderItemSchema } from "./orderItem.schema";
import { IOrder, OrderStatus } from "./order.interface";
import { PaymentMethod } from "./payment.interface";

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: {
            type: [OrderItemSchema],
            default: [],
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
        // paymentResult: {
        //     id: { type: String, required: true },
        //     status: { type: String, required: true },
        //     update_time: { type: String, required: true },
        //     email_address: { type: String, required: true },
        // },
        contactInfo: {
            name: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            postalCode: { type: String, required: true },
            address: { type: String, required: true },
        },
        shippingPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

export const OrderModel = mongoose.model<IOrder, PaginateModel<IOrder>>("Order", OrderSchema);
