const index = function (req, res) {
    res.render("admin/voucher", {
        type: "voucher"
    });
};
export default { index };
