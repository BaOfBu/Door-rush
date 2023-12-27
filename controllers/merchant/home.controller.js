const index = function (req, res) {
    res.render("merchant/home", {
        type: "home"
    });
};
export default { index };
