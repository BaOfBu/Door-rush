import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";

export default {
    findMerchantInfo(merchantId){
        return Merchant.findOne({_id: merchantId}).exec();
    },
    findByHistory(merchantId) {
        return Order.find({merchantId: merchantId,
            $or: [
              { status: 'Hoàn thành' },
              { status: 'Đã hủy' }
            ]
          }).exec();
    },
    findByStatus(merchantId, status) {
        return Order.find({ merchantId: merchantId, status: status}).exec();
    },
    updateStatus(orderId, newStatus){
        return Order.findByIdAndUpdate(orderId, {status: newStatus}, {new: true}).exec();
    },
    updateStatusMerchant(merchantId, newStatus){
        return Merchant.findByIdAndUpdate(merchantId, {statusMerchant: newStatus}, {new: true}).exec();
    }
};
