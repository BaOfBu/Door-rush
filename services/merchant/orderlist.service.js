import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";

export default {
    findOrderList(merchantId) {
        return Order.find({ merchantId: merchantId })
            .populate({
                path: 'merchantId',
                select: 'name image statusMerchant timeRegister',
            })
            .populate({
                path: 'items',
                populate: {
                    path: 'productId',
                },
            })
            .populate('addressOrder')
            .populate('userId');
    },
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