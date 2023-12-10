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
// [GET]/foods/{{shop_id}}/{{foodID}}
const foodDetail = async function (req, res) {
    // Get the params from the route
    const shopId = req.params.shop || 0;
    const foodId = req.params.id || 0;
    // Handle the problem
    if (!shopId) {
        return res.redirect("/");
    }
    if (!foodId) {
        return res.redirect("/shop");
    }
    // Get the value for website
    let foodName = foodId;
    let shopName = shopId;
    let foodPrice = "55.000 VNĐ";
    let userRatingAvg = 0;
    let userRatingAll = [1, 2, 3, 4, 5, 6];
    let typeOfFood = ["Loại 1", "Loại 2", "Loại 3"];
    res.render("user/food-detail.hbs", {
        // Data of page
        shopName: shopName,
        foodName: foodName,
        foodPrice: foodPrice,
        userRatingAvg: userRatingAvg > 0,
        userRatingAll: userRatingAll,
        // data of header
        user: false,
        typeOfFood: typeOfFood,
        type: "food",
        userName: "Họ và tên"
    });
};
export default { index, foodDetail, shop };
