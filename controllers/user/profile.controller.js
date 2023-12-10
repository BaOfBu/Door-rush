const index = function (req, res) {
    res.render("user/profile", {
        type: "home",
        userName: "Họ và tên"
    });
};
export default { index };