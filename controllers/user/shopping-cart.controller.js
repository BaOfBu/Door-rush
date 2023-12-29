import User from "../../models/userModel.js"
import Order from "../../models/orderModel.js"
import OrderItem from "../../models/orderItemModel.js"
import Voucher from "../../models/voucherModel.js"
import e from "express"

const getItemList = async (order) => {
    let itemList = []
    for(const each of order.items){
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

const getActiveVoucher = async (type) => {
    const now = Date.now() 
    const voucher = await Voucher.find({
        startDate: {$lte: now}, 
        endDate: {$gte: now}, 
        typeVoucher: type
    }).exec()
    let result = []
    for(const each of voucher){
        const temp = {
            _id: each._id,
            voucherId: each.voucherId,
            startDate: each.startDate,
            endDate: each.endDate,
            typeVoucher: type,
            discount: each.valueOfDiscount
        }
        result.push(temp)
    }
    return result
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

const calculateTotal = (itemList, curFoodVoucher, curShipVoucher) => {
    let total = 0
    for(const each of itemList){
        
        total = total + each.itemTotal
    }
    const allDiscount = curFoodVoucher.discount + curShipVoucher.discount
    total = (total < allDiscount) ? 0 : (total - allDiscount)
    return total
}

const getOrder = async (req, res, next) => {
    const userID = "658bc732b2e15b47b4ab3653"
    const orderID = "658bc733b2e15b47b4ab365e"

    const order = await Order.findById(orderID).exec()
    if(!order){
        res.render("user/shopping-cart", {
            user: true,
            noItem: true
        })
    } else {
        const itemList = await getItemList(order)
        console.log(itemList)
        const foodVoucher = await getActiveVoucher("food")
        console.log(foodVoucher)
        const shipVoucher = await getActiveVoucher("ship")
        console.log(shipVoucher)
        const addresses = await getSaveAddress(userID)
        console.log(addresses)
        const total = calculateTotal(itemList, foodVoucher[0], shipVoucher[0])
        console.log(total)
        for(const each of foodVoucher){
            console.log(each.voucherId)
            console.log(each.discount)
        }
        res.render("user/shopping-cart", {
            user: true,
            noItem: false,
            itemList: itemList,
            foodVoucher: foodVoucher,
            shipVoucher: shipVoucher,
            addresses: addresses,
            total: total
        })
    }
}
export default {
    getOrder
}