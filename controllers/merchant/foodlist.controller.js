const index = function (req, res) {
    res.render("merchant/foodlist", {
        type: "products"
    });
};

export default { index };
