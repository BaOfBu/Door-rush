const index = function (req, res) {
    res.render("admin/manage-shop", {
        type: "manage-shop"
    });
};
export default { index };
