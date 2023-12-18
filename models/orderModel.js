import mongoose from "mongoose";
import Voucher from "./voucherModel.js";
import OrderItem from "./orderItemModel.js";

const orderSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant"
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderItem"
        }
    ],
    status: {
        type: String,
        enum: ["Đang chờ", "Đang chuẩn bị", "Đang giao", "Hoàn thành", "Đã hủy"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    vouchers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher"
        }
    ],
    total: Number,
    timeOrder: Date
},
    {collection: "Order"}
);

const Order = mongoose.model("Order", orderSchema, "Order");

export default Order;
