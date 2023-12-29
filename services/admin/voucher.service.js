import Voucher from "../../models/voucherModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return Voucher.find();
    },
    findAll(offset, limit) {
        return Voucher.find().skip(offset).limit(limit);
    },
    countDocuments() {
        return Voucher.countDocuments();
    },
    save(entity) {
        const newVoucher = new Voucher(entity);
        return newVoucher.save();
    },
    delete(voucherId) {
        const voucherObjectId = new mongoose.Types.ObjectId(voucherId);
        return Voucher.deleteOne({ _id: voucherObjectId });
    }
};
