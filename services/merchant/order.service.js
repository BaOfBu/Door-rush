import Order from "../../models/orderModel.js";

export default {
    findAll() {
        return Order.find();
    },
    findById(orderId) {
        return Order.findById(orderId);
    },
    findTheInCartMerchant(merchantId) {
        return Order.find({ merchantId: merchantId});
    },
    findTheWaitingOrder(merchantId) {
        return Order.find({ merchantId: merchantId, status: "Đang chờ" });
    },
    findThePreparingOrder(merchantId) {
        return Order.find({ merchantId: merchantId,status: "Đang chuẩn bị" });
    },
    findTheDeliveringOrder(merchantId) {
        return Order.find({ merchantId: merchantId,status: "Đang giao" });
    },
    findTheFinishOrder(merchantId) {
        return Order.find({ merchantId: merchantId,status: "Hoàn thành" });
    },
    findTheCancelOrder(merchantId) {
        return Order.find({ merchantId: merchantId,status: "Đã hủy" });
    },
};
