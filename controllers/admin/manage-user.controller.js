const index = function (req, res) {
    res.render("admin/manage-user", {
        type: "manage-user"
    });
};
export default { index };
