import mongoosePaginate from "mongoose-paginate-v2";
import mongoose, { PaginateModel, Schema } from "mongoose";
import { OrderItemSchema } from "./orderItem.schema";
import { IOrder, OrderStatus } from "./order.interface";
import { PaymentMethod, PaymentStatus } from "../payment/payment.interface";

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: {
            type: [OrderItemSchema],
            default: [],
            required: true,
        },
        contactInfo: {
            name: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            postalCode: { type: String, required: true },
            address: { type: String, required: true },
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Pending,
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: Object.values(PaymentStatus),
            default: PaymentStatus.Pending,
            required: true,
        },
        paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
        paymentMethodId: { type: String },
        paymentIntentId: { type: String },
        orderFailureReason: { type: String },
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
