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
    },
    findById(id) {
        return Voucher.findById(id);
    },
    async findAndUpdate(id, entity) {
        try {
            const updatedVoucher = await Voucher.findOneAndUpdate({ _id: id }, entity, { new: true, useFindAndModify: false });

            if (!updatedVoucher) {
                console.log("No voucher found with the specified ID");
            } else {
                // console.log("Voucher updated successfully:", updatedVoucher);
            }
        } catch (err) {
            console.error("Error updating voucher:", err);
        }
    }
};
