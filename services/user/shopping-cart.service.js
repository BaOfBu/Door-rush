import User from "../../models/userModel.js";
import Order from "../../models/orderModel.js";
import OrderItem from "../../models/orderItemModel.js";
import Voucher from "../../models/voucherModel.js";
import Address from "../../models/addressModel.js";
import FoodType from "../../models/foodTypeModel.js";
import { populate } from "dotenv";

const getOrderItems = async (orderItemsID, order) => {
    let itemList = [];
    for (const each of order.items){
        let total = each.typeFoodId.price * each.quantity;
        total = new Intl.NumberFormat("vi-VN").format(total) + " Đ";

        let price = each.typeFoodId.price;
        price = new Intl.NumberFormat("vi-VN").format(price) + " Đ";
        const temp = {
            itemID: each._id,
            itemImage: each.foodId.image,
            itemName: each.foodId.name,
            itemType: each.typeFoodId.product,
            itemPrice: price,
            itemQuantity: each.quantity,
            itemTotal: total
        };
        itemList.push(temp);
    }
    return itemList;
};

const calculateTotal = async (orderID) => {
    const order = await Order.findById(orderID)
    .populate("vouchers addressOrder")
    .populate({ path: "items", populate: { path: "typeFoodId" } })
    .exec()
    let total = 0;
    for (const each of order.items) {
        // try{
            total = total + each.typeFoodId.price * each.quantity;
        // }catch(error){}
    }

    const distance = 1;
    total = distance > 2 ? total + 25000 : total + 13000;

    let allDiscount = 0;
    for (const each of order.vouchers) {
        allDiscount += each.valueOfDiscount;
    }
    total = total < allDiscount ? 0 : total - allDiscount;

    return total;
};

const getOrderDetail = async orderID => {
    const order = await Order.findById(orderID)
    .populate("vouchers addressOrder")
    .populate({ path: "items", populate: { path: "typeFoodId foodId" }})
    .exec();
    const orderItems = await getOrderItems(order.items, order);

    let orderFoodVoucher;
    let orderShipVoucher;
    for (const each of order.vouchers) {
        if (each.typeVoucher == "food") {
            const discount = new Intl.NumberFormat("vi-VN").format(each.valueOfDiscount) + " Đ";
            orderFoodVoucher = {
                voucherId: each.voucherId,
                valueOfDiscount: discount
            };
        }
        if (each.typeVoucher == "ship") {
            const discount = new Intl.NumberFormat("vi-VN").format(each.valueOfDiscount) + " Đ";
            orderShipVoucher = {
                voucherId: each.voucherId,
                valueOfDiscount: discount
            };
        }
    }

    let addressOrder;
    if (order.addressOrder) {
        addressOrder =
            order.addressOrder.houseNumber +
            " " +
            order.addressOrder.street +
            ", " +
            order.addressOrder.ward +
            ", " +
            order.addressOrder.district +
            ", " +
            order.addressOrder.city;
    }

    const total = new Intl.NumberFormat("vi-VN").format(order.total) + " Đ";

    const orderDetail = {
        orderItems: orderItems,
        orderFoodVoucher: orderFoodVoucher,
        orderShipVoucher: orderShipVoucher,
        addressOrder: addressOrder,
        total: total
    };
    return orderDetail;
};

const formatDate = date => {
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear();
    const result = day + "/" + month + "/" + year;
    return result;
};

const getActiveVoucher = async (type, voucherId) => {
    const now = Date.now();
    const voucher = await Voucher.find({
        voucherId: { $regex: voucherId, $options: "i" },
        startDate: { $lte: now },
        endDate: { $gte: now },
        typeVoucher: type
    })
        .sort({ endDate: 1 })
        .exec();
    let result = [];
    for (const each of voucher) {
        const startDate = formatDate(each.startDate);
        const endDate = formatDate(each.endDate);
        const discount = new Intl.NumberFormat("vi-VN").format(each.valueOfDiscount) + " Đ";
        const temp = {
            _id: each._id,
            voucherId: each.voucherId,
            startDate: startDate,
            endDate: endDate,
            typeVoucher: each.typeVoucher,
            valueOfDiscount: discount
        };
        result.push(temp);
    }
    return result;
};

const updateTotal = async orderID => {
    const total = await calculateTotal(orderID);
    await Order.findOneAndUpdate({ _id: orderID }, { total: total }, { new: true });
};

const deleteVoucher = async (voucherID, orderID) => {
    const order = await Order.findOneAndUpdate(
        { _id: orderID },
        {
            $pullAll: {
                vouchers: [{ _id: voucherID }]
            }
        },
        { new: true }
    );
};

const getSaveAddress = async userID => {
    const saveAddress = await User.findById(userID).select("addresses").populate("addresses").exec();
    let addresses = [];
    for (let each of saveAddress.addresses) {
        const address = each.houseNumber + " " + each.street + ", " + each.ward + ", " + each.district + ", " + each.city;
        addresses.push(address);
    }
    return addresses;
};

const formatAddress = address => {
    let parts = address.split(", ");
    let split = parts[0].split(" ");
    let rest = "";
    for (let j = 1; j < split.length; j++) {
        rest += split[j];
        if (j !== split.length - 1) rest += " ";
    }
    let dataAddress = {
        houseNumber: split[0],
        street: rest,
        ward: parts[1],
        district: parts[2],
        city: parts[3]
    };
    return dataAddress;
};

const findAddressInDatabase = async dataAddress => {
    const address = await Address.findOne({
        houseNumber: dataAddress.houseNumber,
        street: dataAddress.street,
        ward: dataAddress.ward,
        district: dataAddress.district,
        city: dataAddress.city
    });
    return address;
};

const addAddressToOrder = async (orderID, addressID) => {
    const order = await Order.findOneAndUpdate({ _id: orderID }, { addressOrder: addressID }, { new: true });
    return order.addressOrder ? true : false;
};

const updateStatus = async orderID => {
    const changeStatus = await Order.findOneAndUpdate({ _id: orderID }, { status: "Đang chờ" }, { new: true });
    return changeStatus.status ? true : false;
};

const updateTimeStatus = async orderID => {
    const now = Date.now();
    const changeTimeStatus = await Order.findOneAndUpdate({ _id: orderID }, { $set: { "timeStatus.0": now } }, { new: true });
    return changeTimeStatus.timeStatus[0] ? true : false;
};

const findOrderById = async orderID => {
    return await Order.findById(orderID).exec();
};

const findVoucherById = async voucherID => {
    return await Voucher.findById(voucherID).exec();
};

const getOrderVoucher = async orderID => {
    return await Order.findById(orderID).populate("vouchers").exec();
};

const createNewAddress = async dataAddress => {
    let newAddress = new Address(dataAddress);
    await newAddress.save();
    return newAddress;
};
const updateOrderUser = async (userId, orderId) => {
    const add = await User.findByIdAndUpdate(userId, { $push: { orders: orderId } }, { new: true });
    return add;
};
const updateQuantity = async (orderID) => {
    const order = await Order.findOne({_id: orderID})
    .populate({ path: "items", populate: { path: "typeFoodId" }})
    .exec()
    try{
        for(const each of order.items){
            let newQuantity = (each.typeFoodId.quantity - each.quantity)
            if(newQuantity < 0){
                throw new Error()
            }
            if(newQuantity > 0){
                const foodType = await FoodType.findOneAndUpdate({_id: each.typeFoodId._id}, {
                    quantity: newQuantity
                }, {new: true})
            }else{
                const foodType = await FoodType.findOneAndUpdate({_id: each.typeFoodId._id}, {
                    quantity: newQuantity,
                    status: "Hết hàng"
                }, {new: true})
            }
        }
    }catch(error){
        return false
    }
    return true
}

const deleteItem = async (orderID, orderItemID) => {
    try{
        const orderItem = await OrderItem.findOneAndDelete({_id: orderItemID}).exec();
        const order = await Order.findOneAndUpdate(
            { _id: orderID },
            {
                $pullAll: {
                    items: [{ _id: orderItemID }]
                }
            },
            { new: true }
        );
    }catch(error){
        return false;
    }
    return true;
}

const deleteAllItems = async (orderID) => {
    const order = await Order.findOne({_id: orderID}).lean().exec()
    try{
        for(const each of order.items){
            const orderItem = await OrderItem.findOneAndDelete({_id: each}).exec();
        }
    }catch(error){ return false}
    return true;
}

const removeItems = async orderID => {
    const order = await Order.findOneAndUpdate(
        { _id: orderID },
        {
            $set: {items: []}
        },
        { new: true }
    );
}

export default {
    getOrderItems,
    calculateTotal,
    getOrderDetail,
    formatDate,
    getActiveVoucher,
    updateTotal,
    deleteVoucher,
    getSaveAddress,
    formatAddress,
    findAddressInDatabase,
    addAddressToOrder,
    updateStatus,
    updateTimeStatus,
    findOrderById,
    findVoucherById,
    createNewAddress,
    getOrderVoucher,
    updateOrderUser,
    updateQuantity,
    deleteItem,
    deleteAllItems,
    removeItems
};
