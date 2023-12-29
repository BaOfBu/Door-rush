import Order from "../../models/orderModel.js";

export default {
    findAll() {
        return Order.find();
    },
    findById(orderId) {
        return Order.findById(orderId);
    }
};
