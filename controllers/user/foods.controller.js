// [GET]/foods
const index = function (req, res) {
    res.render("user/foods", {
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};
// [GET]/foods/{{shop_name}}
const shop = function (req, res) {
    res.render("user/shop", {
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};
// [GET]/foods/{{shop_name}}/{{foodID}}
const foodDetail = async function (req, res) {
    const foodId = req.params.id || 0;
    if (!foodId) {
        return res.redirect("/shop");
    }
    let countRating = [1, 2, 3, 4, 5, 6];
    res.render("user/food-detail.hbs", {
        countRating: countRating,
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};
export default { index, foodDetail, shop };
