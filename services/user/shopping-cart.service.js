import User from "../../models/userModel.js"
import Order from "../../models/orderModel.js"
import OrderItem from "../../models/orderItemModel.js"
import Voucher from "../../models/voucherModel.js"
import Address from "../../models/addressModel.js"

const getOrderItems = async (orderItemsID) => {
    let itemList = []
    for(const each of orderItemsID){
        const item = await OrderItem.findById(each._id)
                                    .populate("foodId typeFoodId").exec()
        const total = item.typeFoodId.price * item.quantity
        const temp = {
            itemImage: item.foodId.image,
            itemName: item.foodId.name,
            itemType: item.typeFoodId.product,
            itemPrice: item.typeFoodId.price,
            itemQuantity: item.quantity,
            itemTotal: total
        }
        itemList.push(temp)
    }
    return itemList
}

const calculateTotal= async (orderID) => {
    const order = await Order.findById(orderID).populate("vouchers addressOrder").exec()
    let total = 0
    for(const each of order.items){
        const item = await OrderItem.findById(each._id)
                                    .populate("foodId typeFoodId").exec()
        total = total + (item.typeFoodId.price * item.quantity)
    }

    const distance = 3
    total = (distance > 2) ? (total + 25000) : (total + 13000)

    let allDiscount = 0
    for(const each of order.vouchers){
        allDiscount += each.valueOfDiscount
    }
    total = (total < allDiscount) ? 0 : (total - allDiscount)

    return total
}

const getOrderDetail = async (orderID) => {
    const order = await Order.findById(orderID)
                    .populate("vouchers addressOrder").exec()
    const orderItems = await getOrderItems(order.items)

    let orderFoodVoucher; let orderShipVoucher
    for(const each of order.vouchers){
        if(each.typeVoucher == "food"){
            orderFoodVoucher = {
                voucherId: each.voucherId,
                valueOfDiscount: each.valueOfDiscount
            }
        }
        if(each.typeVoucher == "ship"){
            orderShipVoucher = {
                voucherId: each.voucherId,
                valueOfDiscount: each.valueOfDiscount
            }
        }
    }

    let addressOrder
    if(order.addressOrder){
        addressOrder = order.addressOrder.houseNumber 
                    + " " + order.addressOrder.street 
                    + ", " + order.addressOrder.ward 
                    + ", " + order.addressOrder.district 
                    + ", " + order.addressOrder.city 
    }

    const orderDetail = {
        orderItems: orderItems,
        orderFoodVoucher: orderFoodVoucher,
        orderShipVoucher: orderShipVoucher,
        addressOrder: addressOrder,
        total: order.total
    }  
    return orderDetail        
}

const formatDate = (date) => {
    const result = date.getMonth()
                    + "/" + date.getDay()
                    + "/" + date.getYear()
    return result
}

const getActiveVoucher = async (type, voucherId) => {
    const now = Date.now() 
    const voucher = await Voucher.find({
        voucherId: {'$regex': voucherId, $options:'i'},
        startDate: {$lte: now}, 
        endDate: {$gte: now}, 
        typeVoucher: type
    })
    .sort({endDate: 1}).exec()
    let result = []
    for(const each of voucher){
        const startDate = formatDate(each.startDate)
        const endDate = formatDate(each.endDate)
        const temp = {
            _id: each._id,
            voucherId: each.voucherId,
            startDate: startDate,
            endDate: endDate,
            typeVoucher: each.typeVoucher,
            valueOfDiscount: each.valueOfDiscount
        }
        result.push(temp)
    }
    return result
}

const updateTotal = async (orderID) => {
    const total = await calculateTotal(orderID)
    await Order.findOneAndUpdate({_id: orderID}, {total: total}, {new: true})
}

const deleteVoucher = async (voucherID, orderID) => {
    const order = await Order.findOneAndUpdate(
        {_id: orderID}, {
            $pullAll: {
                vouchers: [{_id: voucherID}]
            }
        },{new: true}
    )
}

const getSaveAddress = async (userID) => {
    const saveAddress = await User.findById(userID)
                                .select("addresses")
                                .populate("addresses").exec()               
    let addresses = []
    for(let each of saveAddress.addresses){
        const address = each.houseNumber 
                + " " + each.street 
                + ", " + each.ward 
                + ", " + each.district 
                + ", " + each.city 
        addresses.push(address)
    }
    return addresses
}

const formatAddress = (address) => {
    let parts = address.split(", ")
    let split = parts[0].split(" ")
    let rest = ""
    for (let j = 1; j < split.length; j++) {
        rest += split[j]
        if (j !== split.length - 1) rest += " "
    }
    let dataAddress = {
        houseNumber: split[0],
        street: rest,
        ward: parts[1],
        district: parts[2],
        city: parts[3],
    }
    return dataAddress
}

const findAddressInDatabase = async (dataAddress) => {
    const address = await Address.findOne({
        houseNumber: dataAddress.houseNumber,
        street: dataAddress.street,
        ward: dataAddress.ward,
        district: dataAddress.district,
        city:dataAddress.city
    })
    return address
}

const addAddressToOrder = async (orderID, addressID) => {
    const order = await Order.findOneAndUpdate({_id: orderID}, 
        {addressOrder: addressID}, { new: true })
    return (order.addressOrder) ? true : false
}

const updateStatus = async (orderID) => {
    const changeStatus = await Order.findOneAndUpdate(
        {_id: orderID}, {status: "Đang chờ"}, {new: true})
    return (changeStatus.status) ? true : false
}

const updateTimeStatus = async (orderID) => {
    const now = Date.now() 
    const changeTimeStatus = await Order.findOneAndUpdate(
        {_id: orderID}, {$set: { "timeStatus.0": now } }, {new: true})
    return (changeTimeStatus.timeStatus[0]) ? true : false
}

const findOrderById = async (orderID) => {
    return await Order.findById(orderID).exec()
}

const findVoucherById = async (voucherID) => {
    return await Voucher.findById(voucherID).exec()
}

const getOrderVoucher = async (orderID) => {
    return await Order.findById(orderID).populate("vouchers").exec()
}

const createNewAddress = async (dataAddress) => {
    let newAddress = new Address(dataAddress)
    await newAddress.save();
    return newAddress
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
    getOrderVoucher
}