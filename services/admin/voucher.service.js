import Voucher from "../../models/voucherModel.js";

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
    }
};
