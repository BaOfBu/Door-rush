import FoodService from "../../services/user/food.service.js";
import Feedback from "../../models/feedbackModel.js";
import User from "../../models/userModel.js";
import Food from "../../models/foodModel.js";
import Merchant from "../../models/merchantModel.js"

// [GET]/foods
const index = function (req, res) {
    res.render("user/foods", {
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};
// [GET]/foods/{{shop_id}}
const shop = async function (req, res) {
    // Get the params from the route
    const shopName = req.params.shop || 0

    // Handle the problem
    if(!shopName){
        return redirect("/")
    }

    // Get the data of shop
    let shop = await Merchant
    .findOne({name: shopName})
    .populate("category")
    .populate("menu")
    .populate("recommend")
    .lean()

    let recommend = shop.recommend
    console.log(recommend)
    let category = shop.category
    console.log(category)
    let food = shop.menu
    console.log(food)


    res.render("user/shop.hbs", {
        user: false,
        type: "food",
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
    let food = await FoodService.findById(foodId);
    // Get food name
    let foodName = food.name;
    // Get food price
    let foodPrice = food.foodType.map(type => {
        return new Intl.NumberFormat("vi-VN").format(type.price) + " VNĐ";
    });
    // Get type of food
    let typeOfFood = food.foodType.map(type => type.product);
    // Get user rating for food
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

    // Get feedback for foods
    let feedbacks = food.feedbacks.map(fb => {
        let formattedDate = new Date(fb.feedbackDate).toLocaleString("en-GB", {
            hour12: false
        });
        let stars = Array(5).fill(0);
        stars.fill(1, 0, Math.round(fb.rating));
        return {
            ...fb,
            feedbackDate: formattedDate,
            stars
        };
    });
    res.render("user/food-detail.hbs", {
        // Data of page
        foodImg: food.image,
        foodId: foodId,
        shopName: shopName,
        foodName: foodName,
        foodPrice: foodPrice,
        description: food.description,
        rating: food.rating,
        userRating: userRating,
        feedbacks: feedbacks,
        numberOfFeedback: feedbacks.length,
        // data of header
        user: true,
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
// [POST]/foods/{{shop_name}}/{{foodId}}
const giveFeedback = async function (req, res) {
    try {
        let user = await User.findById(req.body.userId);
        let food = await FoodService.findById(req.body.itemId);
        const newFeedback = new Feedback({
            itemId: food._id,
            userId: user._id,
            rating: Number(req.body.rating),
            comment: req.body.comment,
            feedbackDate: req.body.feedbackDate
        });
        const savedFeedback = await newFeedback.save();
        const foodItemId = food._id;
        await Food.findByIdAndUpdate(
            foodItemId,
            {
                $push: { feedbacks: savedFeedback._id }
            },
            { new: true, useFindAndModify: false }
        );
    } catch {
        console.log("None");
    }
};

export default { index, foodDetail, shop, addToCart, giveFeedback };
