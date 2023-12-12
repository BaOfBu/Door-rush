import Food from "../../models/foodModel.js";
import Merchant from "../../models/merchantModel.js";
import FoodType from "../../models/foodTypeModel.js";
import Feedback from "../../models/feedbackModel.js";
// [GET]/foods
const index = function (req, res) {
    res.render("user/foods", {
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};

// [GET]/foods/{{shop_id}}
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
    // Get the data of food
    const food = await Food.findById(foodId);
    const shop = await Merchant.findById(shopId);
    const feedback = await Feedback.find();
    console.log(feedback);
    // Get the value for website
    let foodName = food.name;

    let shopName = shop.name;

    var formatter = new Intl.NumberFormat("vn-IN", { minimumFractionDigits: 0 });
    let foodPrice = formatter.format(food.price) + " VNĐ";

    let userRatingAvg = food.rating;

    let foodTypeId = food.foodType;
    let typeOfFood = [];
    for (let typeId in foodTypeId) {
        typeOfFood.push((await FoodType.findById(foodTypeId[typeId].toString())).product);
    }

    let userRatingAll = [1, 2, 3, 4, 5, 6];

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
