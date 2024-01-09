import mongoose from "mongoose";
import Voucher from "./voucherModel.js";
import OrderItem from "./orderItemModel.js";

const orderSchema = new mongoose.Schema(
    {
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Merchant",
            index: true,
        },
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OrderItem"
            }
        ],
        status: {
            type: String,
            enum: ["Giỏ hàng", "Đang chờ", "Đang chuẩn bị", "Đang giao", "Hoàn thành", "Đã hủy"]
        },
        timeStatus: [{ type: Date }],
        addressOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vouchers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Voucher"
            }
        ],
        total: Number
    },
    { collection: "Order" }
);

const Order = mongoose.model("Order", orderSchema, "Order");

export default Order;
