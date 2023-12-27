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
        .populate("userId")
        .populate("addressOrder")
        .populate("vouchers");
    let orderTime = new Date(order.timeStatus[0]).toLocaleString("en-GB", {
        hour12: true
    });
    let orderPredictTime = "11:40 AM May 16, 2022";
    let shopName = order.merchantId.name;
    let orderStatus = [
        {
            status: "Đang chờ",
            img: "/static/images/user/order-status/confirm-status.png",
            isCurrent: false,
            time: new Date(order.timeStatus[0]).toLocaleString("en-GB", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            })
        },
        {
            status: "Đang chuẩn bị",
            img: "/static/images/user/order-status/prepare-food-status.png",
            isCurrent: false,
            time: new Date(order.timeStatus[1]).toLocaleString("en-GB", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            })
        },
        {
            status: "Đang giao",
            img: "/static/images/user/order-status/delivering-status.png",
            isCurrent: false,
            time: new Date(order.timeStatus[2]).toLocaleString("en-GB", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            })
        },
        {
            status: "Hoàn thành",
            img: "/static/images/user/order-status/finish-status.png",
            isCurrent: false,
            time: new Date(order.timeStatus[3]).toLocaleString("en-GB", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            })
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
    let address = {
        house: String(order.addressOrder.houseNumber + ", " + order.addressOrder.street + ","),
        wardDistrict: String(order.addressOrder.ward + ", " + order.addressOrder.district + ","),
        locationCity: String(order.addressOrder.city)
    };
    const vouchers = order.vouchers;
    let totalDiscount = 0;
    for (const voucher of vouchers) {
        totalDiscount += voucher.valueOfDiscount || 0;
    }
    let orderInfo = {
        shopName: shopName,
        userPhone: order.userId.phone,
        orderPredictTime: orderPredictTime,
        orderTime: orderTime,
        distance: 1.7,
        shipFee: function calculateShipFee(distance) {
            if (distance <= 2) {
                return Intl.NumberFormat("vi-VN").format(13000) + " VNĐ";
            } else if (distance > 2 && distance <= 5) {
                return Intl.NumberFormat("vi-VN").format(25000) + " VNĐ";
            }
        },
        orderId: orderId,
        orderStatus: orderStatus,
        totalItem: order.items.length,
        totalPrice: Intl.NumberFormat("vi-VN").format(String(totalPriceOrder)) + " VNĐ",
        address: address,
        totalDiscount: Intl.NumberFormat("vi-VN").format(String(totalDiscount)) + " VNĐ",
        totalPriceAfterFee: Intl.NumberFormat("vi-VN").format(String(order.total)) + " VNĐ"
    };
    res.render("user/order-status.hbs", {
        orderInfo,
        orderItem: eachOrderItem
    });
};
// Chưa xử lý giao hàng đến (không rõ địa chỉ nào), Chưa xử lý các chi phí giao hàng, thời gian
// 0 -> 2km <-> 13k
// 2km -> 5km <-> 25k
export default { index };
