import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    voucherId: String,
    startDate: Date,
    endDate: Date,
    typeVoucher: {
        type: String,
        enum: ["ship", "food"]
    },
    valueOfDiscount: Number // Tiền
},
    {collection: "Voucher"}
);

const Voucher = mongoose.model("Voucher", voucherSchema, "Voucher");

export default Voucher;