import Voucher from "../../models/voucherModel.js";

export default {
    findAll() {
        return Voucher.find();
    }
};
