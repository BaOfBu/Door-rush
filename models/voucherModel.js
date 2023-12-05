import mongoose from "mongoose";
const voucherSchema = new mongoose.Schema({
    voucherId: String,
    voucherName: String,
    startDate: Date,
    endDate: Date,
    typeVoucher: {
        type: String,
        enum: ["ship", "food"]
    },
    valueOfDiscount: Number // Tiền
});

const Voucher = mongoose.model("Voucher", voucherSchema);

export default Voucher;
