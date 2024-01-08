import { ObjectId } from "mongodb";
import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";

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
    async getUserAddress(merchantID){
        const user = await Merchant.findById(merchantID)
        .select("address")
        .lean()
        .populate({ path: "address" })
        .exec();
        console.log("user: ", user);
        let address = user.address;
        let info = address.houseNumber +
            " " + address.street +
            ", " +
            address.ward +
            ", " +
            address.district +
            ", " +
            address.city;
        return info;
    },
    async getCategory(merchantID){
        const merchant = await Merchant.findById(merchantID)
        .select("category")
        .lean()
        .populate({ path: "category" })
        .exec();
        let categories = "";
        merchant.category.forEach(cat => {
            categories = categories + cat.name + ", ";
        });
        categories = categories.slice(0, -2);
        return categories;
    }
};
