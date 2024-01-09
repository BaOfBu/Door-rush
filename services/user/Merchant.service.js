import Merchant from "../../models/merchantModel.js";

export default {
    findAll() {
        return Merchant.find();
    },
    findByName(merchantName) {
        return Merchant.find({ name: merchantName });
    },
    findByKeyword(keyword) {
        console.log("keyword:", keyword);
        return Merchant.find({ name: { $regex: keyword, $options: "i" } }).lean();
    },

};
