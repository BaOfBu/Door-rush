import Voucher from "../../models/voucherModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return Voucher.find();
    },
    countDocumentWithStatusText(status, text) {
        if (text == "" && status == "") {
            return Voucher.find().countDocuments();
        } else if (text == "" && status != "") {
            const currentDate = new Date();
            if (status == "Active") {
                return Voucher.find({ endDate: { $gte: currentDate } }).countDocuments();
            } else if (status == "Expired") {
                return Voucher.find({ endDate: { $lt: currentDate } }).countDocuments();
            }
        } else if (text != "" && status == "") {
            const textRegex = new RegExp(text, "i");
            return Voucher.find({ voucherId: { $regex: textRegex } }).countDocuments();
        } else if (text != "" && status != "") {
            const currentDate = new Date();
            if (status == "Active") {
                if (text != "") {
                    const textRegex = new RegExp(text, "i");
                    return Voucher.find({
                        voucherId: { $regex: textRegex },
                        endDate: { $gte: currentDate }
                    }).countDocuments();
                }
            } else if (status == "Expired") {
                const currentDate = new Date();
                if (text != "") {
                    const textRegex = new RegExp(text, "i");
                    return Voucher.find({
                        voucherId: { $regex: textRegex },
                        endDate: { $lt: currentDate }
                    }).countDocuments();
                }
            }
        }
    },
    findAllWithStatusAndText(offset, limit, status, text) {
        if (text == "" && status == "") {
            return Voucher.find().skip(offset).limit(limit).sort({ endDate: -1 });
        } else if (text == "" && status != "") {
            const currentDate = new Date();
            if (status == "Active") {
                return Voucher.find({ endDate: { $gte: currentDate } })
                    .skip(offset)
                    .limit(limit);
            } else if (status == "Expired") {
                return Voucher.find({ endDate: { $lt: currentDate } })
                    .skip(offset)
                    .limit(limit);
            }
        } else if (text != "" && status == "") {
            const textRegex = new RegExp(text, "i");
            return Voucher.find({ voucherId: { $regex: textRegex } })
                .skip(offset)
                .limit(limit);
        } else if (text != "" && status != "") {
            const currentDate = new Date();
            if (status == "Active") {
                if (text != "") {
                    const textRegex = new RegExp(text, "i");
                    return Voucher.find({
                        voucherId: { $regex: textRegex },
                        endDate: { $gte: currentDate }
                    })
                        .skip(offset)
                        .limit(limit);
                }
            } else if (status == "Expired") {
                const currentDate = new Date();
                if (text != "") {
                    const textRegex = new RegExp(text, "i");
                    return Voucher.find({
                        voucherId: { $regex: textRegex },
                        endDate: { $lt: currentDate }
                    })
                        .skip(offset)
                        .limit(limit);
                }
            }
        }
    },
    findAllExpired(offset, limit) {
        const currentDate = new Date();
        return Voucher.find({ endDate: { $lt: currentDate } })
            .sort({ endDate: -1 })
            .skip(offset)
            .limit(limit);
    },
    countDocumentsActive() {
        const currentDate = new Date();
        return Voucher.find({ endDate: { $gte: currentDate } })
            .sort({ endDate: -1 })
            .countDocuments();
    },
    countDocumentsExpired() {
        const currentDate = new Date();
        return Voucher.find({ endDate: { $lt: currentDate } })
            .sort({ endDate: -1 })
            .countDocuments();
    },
    findAllActive(offset, limit) {
        const currentDate = new Date();
        return Voucher.find({ endDate: { $gte: currentDate } })
            .sort({ endDate: -1 })
            .skip(offset)
            .limit(limit);
    },
    findAll(offset, limit) {
        return Voucher.find().sort({ endDate: -1 }).skip(offset).limit(limit);
    },
    countDocument() {
        return Voucher.find().countDocuments();
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
