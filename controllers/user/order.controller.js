// [GET]/order?id={{orderId}}
const index = function (req, res) {
    let orderId = req.query.id || 0;
    let orderTime = "11:05 AM Feb 16, 2022";
    let orderPredictTime = "11:40 AM May 16, 2022";
    let shopName = "Cơm Tấm Phúc Lộc Thọ - Nguyễn Thị Minh Khai";
    res.render("user/order-status.hbs", {
        shopName: shopName,
        orderPredictTime: orderPredictTime,
        orderTime: orderTime,
        orderId: orderId,
        user: true,
        userName: "Họ và tên"
    });
};
export default { index };
