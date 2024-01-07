import Merchant from "../../models/merchantModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return Merchant.find();
    },
    findActiveByName(name) {
        return Merchant.find({ name: name, status: "active" });
    },
    findActiveByCCCD(cccd) {
        return Merchant.find({ status: "active", cccd: cccd });
    },
    findPending(offset, limit) {
        return Merchant.find({ status: "pending" }).skip(offset).limit(limit);
    },
    findPendingByID(id) {
        return Merchant.findOne({ status: "pending", _id: id });
    },
    findPendingByUsername(username, offset, limit) {
        const usernameRegex = new RegExp(username, "i");
        return Merchant.find({
            status: "pending",
            username: { $regex: usernameRegex }
        })
            .skip(offset)
            .limit(limit);
    },
    countPendingByUsername(username) {
        const usernameRegex = new RegExp(username, "i");
        return Merchant.countDocuments({
            status: "pending",
            username: { $regex: usernameRegex }
        });
    },
    countPending() {
        return Merchant.find({ status: "pending" }).countDocuments();
    },
    findById(id) {
        return Merchant.findOne({ _id: id });
    }
};
