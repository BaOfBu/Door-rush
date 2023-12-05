const index = function (req, res) {
    res.render("admin/validate-shop", {
        type: "validate-shop"
    });
};
export default { index };
