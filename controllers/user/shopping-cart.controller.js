import User from "../../models/userModel.js"
import Order from "../../models/orderModel.js"
import OrderItem from "../../models/orderItemModel.js"
import Voucher from "../../models/voucherModel.js"

const getCartList = async (req, res, next) => {
    const userID = req.params.userID
    const user = await User.findById(userID).exec()
    console.log(user)
    console.log(user.fullname)
    const fullname = user.fullname
    const orders = await Order.find({userId: user._id, status: "Đang chờ"}).populate("merchantId").exec()
    
    let cartList = []
    for(let order of orders){
        const cart = {
            orderID: order._id,
            merchantName: order.merchantId.name,
            total: order.total,
        }
        cartList.push(cart)
    }
    
    res.render("user/cart-list", {
        user: true,
        userID: userID,
        userFullname: fullname,
        cartList: cartList
    })
}

const getOrder = async (req, res, next) => {
    const userID = req.params.userID
    const orderID = req.params.orderID

    const order = await Order.findById(orderID).exec()

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

    const now = Date.now() 
    console.log(now)
    const foodVoucher = await Voucher.find({
        startDate: {$lte: now}, 
        endDate: {$gte: now}, 
        typeVoucher: "food"
    }).exec()
    console.log(foodVoucher)
    const shipVoucher = await Voucher.find({
        startDate: {$lte: now}, 
        endDate: {$gte: now}, 
        typeVoucher: "ship"
    }).exec()
    console.log(shipVoucher)

    const saveAddress = await User.findById(userID)
                                .select("addresses")
                                .populate("addresses").exec()
    console.log(saveAddress)
    // res.render("user/cart-list", {
    //     user: true,
    //     userID: userID,
    //     orderID: orderID
    // })
}
export default {
    getCartList,
    getOrder
}