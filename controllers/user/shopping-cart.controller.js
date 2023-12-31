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

const getOrderDetail = async (order) => {
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
const displayOrder = async (req, res, next) => {
    const orderID = "659043996f51a58bbdb0b5ea"

    const order = await Order.findById(orderID).populate("vouchers addressOrder").exec()
    if(!order){
        res.render("user/shopping-cart", {
            user: true,
            noItem: true
        })
    } else {
        await updateTotal(orderID)
        let orderDetail = await getOrderDetail(order)
        res.render("user/shopping-cart", {
            user: true,
            noItem: false,
            orderDetail: orderDetail
        })
    }
}

const displayFoodVoucher = async (req, res, next) => {
    const searchID = req.query.voucherId
    const voucherType = "food"
    let voucher
    if(searchID){
        voucher = await getActiveVoucher(voucherType, searchID)
    }else{
        voucher = await getActiveVoucher(voucherType, "")
    }
    res.render("user/voucher", {
        user: true,
        searchID: searchID,
        voucher: voucher,
        voucherType: voucherType
    })
}

const displayShipVoucher = async (req, res, next) => {
    const searchID = req.query.voucherId
    const voucherType = "ship"
    let voucher
    if(searchID){
        voucher = await getActiveVoucher(voucherType, searchID)
    }else{
        voucher = await getActiveVoucher(voucherType, "")
    }
    res.render("user/voucher", {
        user: true,
        searchID: searchID,
        voucher: voucher,
        voucherType: voucherType
    })
}

const updateTotal = async (orderID) => {
    const total = await calculateTotal(orderID)
    await Order.findOneAndUpdate({_id: orderID}, {total: total}, {now: true})
}

const addVoucher = async (req, res, next) => {
    const orderID = "659043996f51a58bbdb0b5ea"
    const id = req.query.id
    const type = req.query.type
    const voucher = await Voucher.findById(id).exec()
    if(!voucher){
        const url = "/shopping-cart/" + type + "-voucher"
        res.redirect(url)
    }else{
        let order = await Order.findById(orderID).populate("vouchers").exec()
        let hasVoucher = false 
        for(const each of order.vouchers){
            if(each.typeVoucher == type){
                hasVoucher = true
            }
        }
        if(!hasVoucher){
            order.vouchers.push(id)
            await order.save()
        }
        await updateTotal(orderID)
        res.redirect("/shopping-cart")
    }
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

const displayAddresss = async (req, res, next) => {
    const userID = "658bc732b2e15b47b4ab3653"
    const saveAddress = await getSaveAddress(userID)
    res.render("user/address.hbs", {
        saveAddress: saveAddress,
        user: true
    })
}

const formetAddress = (address) => {
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

const addAddress = async (req, res, next) => {
    const orderID = "659043996f51a58bbdb0b5ea"
    const address = req.query.address
    if(!address){
        res.redirect("/shopping-cart/address")
    }else{
        const dataAddress = formetAddress(address)
        const dbAddress = await findAddressInDatabase(dataAddress)
        let isAdd = false
        if(!dbAddress){
            let newAddress = new Address(dataAddress)
            await newAddress.save();
            isAdd = await addAddressToOrder(orderID, newAddress._id)
        }else{
            isAdd = await addAddressToOrder(orderID, dbAddress._id)
        }
    
        if(isAdd){
            res.redirect("/shopping-cart")
        }else{
            res.redirect("/shopping-cart/address")
        }
    }
}

export default {
    displayOrder,
    displayFoodVoucher,
    displayShipVoucher,
    addVoucher,
    displayAddresss,
    addAddress
}