import OrderService from "../../services/user/order.service.js";
// [GET]/order?id={{orderId}}
const index = async function (req, res) {
    if (req.session.auth === false) {
        res.redirect("/account/login");
    } else {
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
        // console.log(order);
        let orderTime = new Date(order.timeStatus[0]).toLocaleString("en-GB", {
            hour12: true
        });
        let shopName = order.merchantId.name;
        let orderStatus = [
            {
                status: "Đang chờ",
                img: "/static/images/user/order-status/confirm-status.png",
                isCurrent: false,
                isNext: false,
                time: order.timeStatus[0]
                    ? new Date(order.timeStatus[0]).toLocaleString("en-GB", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                      })
                    : null
            },
            {
                status: "Đang chuẩn bị",
                img: "/static/images/user/order-status/prepare-food-status.png",
                isCurrent: false,
                isNext: false,
                time: order.timeStatus[1]
                    ? new Date(order.timeStatus[1]).toLocaleString("en-GB", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                      })
                    : null
            },
            {
                status: "Đang giao",
                img: "/static/images/user/order-status/delivering-status.png",
                isCurrent: false,
                isNext: false,
                time: order.timeStatus[2]
                    ? new Date(order.timeStatus[2]).toLocaleString("en-GB", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                      })
                    : null
            },
            {
                status: "Hoàn thành",
                img: "/static/images/user/order-status/finish-status.png",
                isCurrent: false,
                isNext: false,
                time: order.timeStatus[3]
                    ? new Date(order.timeStatus[3]).toLocaleString("en-GB", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true
                      })
                    : null
            }
        ];
        let predictTime;
        let isCurrent;
        for (let i = 3; i >= 0; i--) {
            if (order.timeStatus[i] != null) {
                isCurrent = i;
                orderStatus[i].isCurrent = true;
                if (i != 2) {
                    predictTime = new Date(order.timeStatus[i].getTime() + 5 * 60000).toLocaleString("en-GB", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                    });
                } else {
                    predictTime = new Date(order.timeStatus[i].getTime() + 15 * 60000).toLocaleString("en-GB", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                    });
                }

                if (i != 3) orderStatus[i + 1].isNext = true;
                break;
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
            isCurrent: isCurrent,
            orderInfo: orderInfo,
            predictTime: predictTime,
            orderItem: eachOrderItem
        });
    }
};

export default { index };
