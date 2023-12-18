import Food from "../../models/foodModel.js";
import FoodType from "../../models/foodTypeModel.js"
// [GET]/foods
const index = async function (req, res, next) {

    let foods = await Food.find().lean();
    let foodType = await FoodType.find().lean();


    res.render("user/foods", {
        user: false,
        type: "food",
        foods: foods,
        FoodType: foodType,
        userName: "Họ và tên"
    });
};

// [GET]/foods/{{shop_id}}
const shop = function (req, res) {
    res.render("user/shop", {
        user: false,
        type: "shop",
        userName: "Họ và tên"
    });
};

// [GET]/foods/{{shop_name}}/{{foodID}}
const foodDetail = async function (req, res) {
    // Get the params from the route
    const shopName = req.params.shop || 0;
    const foodId = req.params.id || 0;

    // Handle the problem
    if (!shopName) {
        return res.redirect("/");
    }
    if (!foodId) {
        return res.redirect("/shop");
    }

    // Get the data of food
    let food = await Food.findById(foodId).populate("foodType").populate("feedbacks");

    // Get data for the website
    let foodName = food.name;

    let foodPrice = food.foodType.map(type => {
        return new Intl.NumberFormat("vi-VN").format(type.price) + " VNĐ";
    });

    let typeOfFood = food.foodType.map(type => type.product);

    let userRating = [];
    for (let i = 1; i <= Math.round(food.rating); i++) {
        userRating.push({
            isRate: true
        });
    }
    for (let i = 1; i <= 5 - Math.round(food.rating); i++) {
        userRating.push({
            isRate: false
        });
    }

    let feedbacks = food.feedbacks;

    let userRatingAll = [1, 2, 3, 4, 5, 6];

    res.render("user/food-detail.hbs", {
        // Data of page
        foodId: foodId,
        shopName: shopName,
        foodName: foodName,
        foodPrice: foodPrice,
        description: food.description,
        rating: food.rating,
        userRating: userRating,
        userRatingAll: userRatingAll,
        numberOfFeedback: feedbacks.length,
        // data of header
        user: false,
        typeOfFood: typeOfFood,
        type: "food",
        userName: "Họ và tên"
    });
};

// [Get]/foods/{{shop_name}}/{{foodId}}/add-to-cart
const addToCart = async function (req, res) {
    // Get the params from the route
    req.session.numberItem = req.session.numberItem + 1;
    res.redirect(req.headers.referer);
};

export default { index, foodDetail, shop, addToCart };
