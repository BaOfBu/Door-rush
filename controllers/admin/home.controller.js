const index = function (req, res) {
    res.render("admin/home", {
        type: "home"
    });
};
export default { index };
