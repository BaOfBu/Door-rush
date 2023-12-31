import Order from "../../models/orderModel.js";

export default {
    findAll() {
        return Order.find();
    },
    findById(orderId) {
        return Order.findById(orderId);
    },
    findTheInCartUserId(userId) {
        return Order.find({ userId: userId, status: "Giỏ hàng" });
    }
};
