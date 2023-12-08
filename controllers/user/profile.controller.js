const index = function (req, res) {
    res.render("user/profile", {
        user: false,
        type: "home",
        userName: "Họ và tên"
    });
};
export default { index };