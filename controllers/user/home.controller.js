const index = function (req, res) {
    res.render("user/home", {
        user: false,
        type: "home",
        userName: "Họ và tên"
    });
};
export default { index };
