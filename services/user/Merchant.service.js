import Merchant from "../../models/merchantModel.js";

export default {
    findAll() {
        return Merchant.find();
    },
    findByName(merchantName) {
        return Merchant.find({ name: merchantName });
    }
};
