import Merchant from "../../models/merchantModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return Merchant.find();
    },
    findPending(offset, limit) {
        return Merchant.find({ status: "pending" }).skip(offset).limit(limit);
    },
    findPendingByID(id) {
        return Merchant.findOne({ status: "pending", _id: id });
    },
    countPending() {
        return Merchant.find({ status: "pending" }).countDocuments();
    }
};
