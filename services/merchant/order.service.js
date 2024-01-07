import { ObjectId } from "mongodb";
import Order from "../../models/orderModel.js";

export default {
    findAll() {
        return Order.find();
    },
    findById(orderId) {
        return Order.findById(orderId);
    },
    findTheInCartMerchant(Id) {
        return Order.find({ merchantId: Id});
    },
    findTheWaitingOrder(Id) {
        var id = new ObjectId(Id);
        return Order.find({ merchantId: id, status: "Đang chờ" }).count();
    },
    findThePreparingOrder(Id) {
        var id = new ObjectId(Id);
        return Order.find({ merchantId: id,status: "Đang chuẩn bị" }).count();
    },
    findTheDeliveringOrder(Id) {
        var id = new ObjectId(Id);
        return Order.find({ merchantId: id,status: "Đang giao" }).count();
    },
    findTheFinishOrder(Id) {
        var id = new ObjectId(Id);
        return Order.find({ merchantId: id,status: "Hoàn thành" }).count();
    },
    findTheCancelOrder(Id) {
        var id = new ObjectId(Id);
        return Order.find({ merchantId: id,status: "Đã hủy" }).count();
    },
};
