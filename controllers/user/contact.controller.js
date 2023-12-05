const index = function (req, res) {
    res.render("user/contact", {
        user: false,
        type: "contact",
        userName: "Họ và tên"
    });
};
export default { index };
