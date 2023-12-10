import mongoose from "mongoose";
import Voucher from "./voucherModel.js"
import Merchant from "./merchantModel.js"

const orderItemSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food"
    },
    typeFoodId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeFood"
    },
    quantity: Number,
    notes: String
});

const orderSchema = new mongoose.Schema({
    merchantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Merchant"
    },
    id: Number,
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ["pending", "preparing", "delivering", "delivered", "cancelled"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    voucher: Voucher,
    total: Number,
    timeOrder: Date
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
