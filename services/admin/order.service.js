import Order from "../../models/orderModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return Order.find();
    },
    findAllOrderOfMerchant(merchantId) {
        return Order.find({ merchantId: new mongoose.Types.ObjectId(merchantId), status: "Hoàn thành" });
    }
};
