import OrderList from "../../services/merchant/orderlist.service.js";
import User from "../../services/user/profile.service.js";
import OrderService from "../../services/user/order.service.js";

const orderList = async function (req, res){
    const merchantId = req.session.authUser._id;
    const optional = req.query.optional || 'preparing';

    const merchantInfo = OrderList.findMerchantInfo(merchantId);

    const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
    const options = { timeZone: vietnamTimeZone, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const limit = 4;
    const page = req.query.page || 1;
    const offset = (page - 1) * limit;

    let status = 'Đang chuẩn bị';
    if(optional === 'delivering') status = 'Đang giao';
    if(optional === 'history') {
        status = 'Lịch sử';
        let tmpStatus = req.query.status || 'all';
        let startDate = req.query.startDate || null;
        let endDate = req.query.endDate || null;
        let orderList = [];

        let statusFilter = tmpStatus;
        if(statusFilter === "all") statusFilter = "Tất cả trạng thái";
        if(statusFilter === "delivered") statusFilter = "Hoàn thành";
        if(statusFilter === "cancelled") statusFilter = "Đã hủy";

        if(tmpStatus === 'all'){
            orderList = await OrderList.findByHistory(merchantId);
            console.log(orderList);
        }else{
            orderList = await OrderList.findByStatus(merchantId, statusFilter);
            console.log(orderList);
        }

        const orderInfoPromises = orderList.map(async (order) => {
            try {
                let user = await User.getUserInfo(order.userId);
                let orderId = order._id;
                let userId = user._id;
                let username = user.username;
                let timeOrder = order.timeStatus[0].toLocaleDateString('en-US', options);
                let quantity = await User.countQuantityItemsOfOrder(order._id);
                let total = order.total;
                let status = 'Lịch sử';
                let statusFilter = order.status;

                return {orderId, userId, username, timeOrder, quantity, total, status, statusFilter};
            } catch (error) {
                console.error('Lỗi khi xử lý đơn hàng:', error);
                console.error(order.userId);
                throw error; // Bạn có thể muốn xử lý lỗi hoặc đăng nó theo cách thích hợp
            }
        });

        let orders = await Promise.all(orderInfoPromises);

        let start;
        let end;
        
        if(startDate && endDate){
            start = new Date(startDate);
            console.log("start: ", start);
            end = new Date(endDate);
            console.log("end: ", end);
        }

        if (statusFilter !== "Tất cả trạng thái") {
            if(startDate && endDate){
                orders = orders.filter(order => {
                    let timeOrder = new Date(order.timeOrder);
                    return order.statusFilter === statusFilter &&
                    timeOrder >= start && timeOrder <= end
                });
            }else{
                orders = orders.filter(order => {
                    return order.statusFilter === statusFilter
                });
            }
        }else{
            if(startDate && endDate){
                orders = orders.filter(order => {
                    let timeOrder = new Date(order.timeOrder);
                    return timeOrder >= start && timeOrder <= end
                });
            }
        }
        
        const total = orders.length;
        const nPages = Math.ceil(total / limit);

        const pageNumbers = [];
        for (let i = 1; i <= nPages; i++) {
            pageNumbers.push({
            value: i,
            isActive: i === +page,
            status: status,
            statusFilter: tmpStatus,
            startDate: startDate,
            endDate: endDate
            });
        }

        let list = orders;
        if(total > offset){
            list = orders.slice(offset, offset+limit); 
        }

        let isFirstPage = false;
        if(Number(page) === 1) isFirstPage = true;

        let isLastPage = false;
        if(Number(page) === nPages) isLastPage = true;

        res.render("merchant/orderlist", {
            type: "orders",
            merchantId: merchantId,
            name: merchantInfo.name,
            image: merchantInfo.image,
            optional: optional,
            status: status,
            orders: list,
            empty: orders.length === 0,
            isFirstPage: isFirstPage,
            isLastPage: isLastPage,
            pageNumbers: pageNumbers,
            statusFilter: statusFilter,
            startDate: startDate,
            endDate: endDate,
        });
    }else{
        let orderList = await OrderList.findByStatus(merchantId, status);
        const orderInfoPromises = orderList.map(async (order) => {
            try {
                let user = await User.getUserInfo(order.userId);
                let orderId = order._id;
                let username = user.username;
                let timeOrder = order.timeStatus[0].toLocaleDateString('en-US', options);
                let quantity = await User.countQuantityItemsOfOrder(order._id);
                let total = order.total;
                let status = order.status;

                return {orderId, username, timeOrder, quantity, total, status};
            } catch (error) {
                console.error('Lỗi khi xử lý đơn hàng:', error);
                throw error; // Bạn có thể muốn xử lý lỗi hoặc đăng nó theo cách thích hợp
            }
        });

        const orders = await Promise.all(orderInfoPromises);

        const total = orders.length;
        const nPages = Math.ceil(total / limit);

        const pageNumbers = [];
        for (let i = 1; i <= nPages; i++) {
            pageNumbers.push({
            value: i,
            isActive: i === +page,
            statusFilter: optional
            });
        }

        let list = orders;
        if(total > offset){
            list = orders.slice(offset, offset+limit); 
        }

        let isFirstPage = false;
        if(Number(page) === 1) isFirstPage = true;

        let isLastPage = false;
        if(Number(page) === nPages) isLastPage = true;

        res.render("merchant/orderlist", {
            type: "orders",
            merchantId: merchantId,
            name: merchantInfo.name,
            image: merchantInfo.image,
            optional: optional,
            status: status,
            orders: list,
            empty: orders.length === 0,
            isFirstPage: isFirstPage,
            isLastPage: isLastPage,
            pageNumbers: pageNumbers,
        });
    }
};

const updateOrders = async function (req, res){
    const orderId = req.body.orderId;
    const newStatus = req.body.newStatus;

    // Xử lý thay đổi trạng thái đơn hàng ở đây (ví dụ: cập nhật trong cơ sở dữ liệu)
    const update = await OrderList.updateStatus(orderId, newStatus);
    console.log("Đã update thành công", update);
    // Gửi phản hồi về client
    res.json({ success: true, message: 'Trạng thái đơn hàng đã được thay đổi.' });
};

const orderDetail = async function (req, res){
    const userId = req.session.authUser._id;
    let orderId = req.params.orderId || 0;
    const order = await OrderService.findById(orderId)
        .populate({
            path: "items",
            populate: [{ path: "foodId" }, { path: "typeFoodId" }]
        })
        .populate("userId")
        .populate("addressOrder")
        .populate("vouchers").exec();
    let orderTime = new Date(order.timeStatus[0]).toLocaleString("en-GB", {
        hour12: true
    });
    let username = order.userId.username;
    let orderStatus = [
        {
            status: "Đang chờ",
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
        username: username,
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
    console.log("Success");
    res.render("merchant/orderdetail", {
        isCurrent: isCurrent,
        orderInfo: orderInfo,
        predictTime: predictTime,
        orderItem: eachOrderItem
    });
};

export default {orderList, updateOrders, orderDetail};
