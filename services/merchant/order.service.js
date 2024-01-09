import { ObjectId } from "mongodb";
import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";
import FoodType from "../../models/foodTypeModel.js";
import Food from "../../models/foodModel.js";

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
    async findTheOutOfStock(merchantId) {
        var res = await Merchant.findById(merchantId).lean();
        var menu = res.menu;
        var count = 0;
        for (var i = 0; i < menu.length; i++) {
            var foods = await Food.findById(menu[i]).lean();
            if(foods.foodType != null){
                var foodtypes = foods.foodType;
                for(var j = 0; j < foodtypes.length; j++){
                    var foodtype = await FoodType.findOne({_id: foodtypes[j]}).lean();
                    if(foodtype.quantity == 0){
                        count++;
                    }
                }
            }
        }
        return count;
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
