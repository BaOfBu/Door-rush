import OrderItem from "../../models/orderItemModel.js";
import OrderService from "../../services/user/order.service.js";
// [GET]/order?id={{orderId}}
const index = async function (req, res) {
    let orderId = req.query.id || 0;
    const order = await OrderService.findById(orderId)
        .populate("merchantId")
        .populate({
            path: "items",
            populate: [{ path: "foodId" }, { path: "typeFoodId" }]
        })
        .populate("userId");
    let orderTime = new Date(order.timeOrder).toLocaleString("en-GB", {
        hour12: false
    });
    let orderPredictTime = "11:40 AM May 16, 2022";
    let shopName = order.merchantId.name;
    let orderStatus = [
        {
            status: "Đang chờ",
            img: "/static/images/user/order-status/confirm-status.png",
            isCurrent: false
        },
        {
            status: "Đang chuẩn bị",
            img: "/static/images/user/order-status/prepare-food-status.png",
            isCurrent: false
        },
        {
            status: "Đang giao",
            img: "/static/images/user/order-status/delivering-status.png",
            isCurrent: false
        },
        {
            status: "Hoàn thành",
            img: "/static/images/user/order-status/finish-status.png",
            isCurrent: false
        }
    ];
    for (let i = 0; i < orderStatus.length; i++) {
        if (orderStatus[i].status === order.status) {
            orderStatus[i].isCurrent = true;
        }
    }
    let totalPriceOrder = 0;
    let eachOrderItem = [];
    for (let i = 0; i < order.items.length; i++) {
        let totalPrice = Number(order.items[i].typeFoodId.price) * Number(order.items[i].quantity);
        totalPriceOrder += totalPrice;
        eachOrderItem.push({
            image: order.items[i].foodId.image,
            notes: order.items[i].notes,
            name: order.items[i].foodId.name + " - " + order.items[i].typeFoodId.product,
            price: Intl.NumberFormat("vi-VN").format(order.items[i].typeFoodId.price) + " VNĐ",
            quantity: order.items[i].quantity,
            totalPrice: Intl.NumberFormat("vi-VN").format(String(totalPrice)) + " VNĐ"
        });
    }

    let orderInfo = {
        shopName: shopName,
        orderPredictTime: orderPredictTime,
        orderTime: orderTime,
        orderId: orderId,
        orderStatus: orderStatus,
        totalItem: order.items.length,
        totalPrice: Intl.NumberFormat("vi-VN").format(String(totalPriceOrder)) + " VNĐ"
    };

    res.render("user/order-status.hbs", {
        orderInfo,
        orderItem: eachOrderItem
    });
};
// Chưa xử lý giao hàng đến (không rõ địa chỉ nào), Chưa xử lý các chi phí giao hàng, thời gian
export default { index };
