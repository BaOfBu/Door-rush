// [GET]/order?id={{orderId}}
const index = function (req, res) {
    let orderId = req.query.id || 0;
    res.render("user/order-status.hbs", {
        user: true,
        userName: "Họ và tên"
    });
};
export default { index };
