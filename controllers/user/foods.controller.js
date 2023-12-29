import FoodService from "../../services/user/food.service.js";
import User from "../../models/userModel.js";
import Food from "../../models/foodModel.js";
import ShopService from "../../services/user/shop.service.js";
import OrderItem from "../../models/orderItemModel.js";
import Feedback from "../../models/feedbackModel.js";
import FoodType from "../../models/foodTypeModel.js";

// [GET]/foods
const index = function (req, res) {
    res.render("user/foods", {
        user: false,
        type: "food",
        userName: "Họ và tên"
    });
};

// [GET]/foods/{{shop}}
const shop = async function (req, res) {
    // Get the params from the route
    const shopName = req.params.shop || 0;

    // Handle the problem
    if (!shopName) {
        return res.redirect("/foods");
    }

    // Get the data of shop
    let shop = await ShopService.findByName(shopName);
    if (!shop) {
        return res.redirect("/foods");
    }

    const shopEmail = shop.email;
    const shopPhone = shop.phone;
    const shopImage = shop.image;
    const shopRating = Math.round(shop.rating);
    let shopAddress = ShopService.mergeAddress(shop);
    let shopFood = await ShopService.getAllFood(shop);
    let shopCategory = ShopService.getAllCategory(shop, shopFood);
    let popularCategory = ShopService.sliceCategory(shopCategory, 0, 9);
    let recommendFood = await ShopService.getRecommendFood(shop);

    res.render("user/shop.hbs", {
        //shop data
        shopEmail: shopEmail,
        shopName: shopName,
        shopImage: shopImage,
        shopAddress: shopAddress,
        shopPhone: shopPhone,
        shopRating: shopRating,
        popularCategory: popularCategory,
        shopCategory: shopCategory,
        recommendFood: recommendFood,
        //header date
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
    let typeOfFoodId = food.foodType.map(type => type._id);
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
        isAccount: req.session.auth,
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
        typeOfFoodId: typeOfFoodId,
        type: "food",
        userName: "Họ và tên"
    });
};
// [POST]/foods/{{shop_name}}/{{foodId}}/addToCart
const addToCart = async function (req, res) {
    // Get the params from the route
    req.session.numberItem = req.session.numberItem + 1;
    let foodId = await FoodService.findByIdForOrderItem(req.body.foodId);
    let foodType = await FoodType.findById(String(req.body.foodType));
    const orderItem = new OrderItem({
        foodId: foodId._id,
        typeFoodId: foodType._id,
        quantity: req.body.quantity,
        notes: req.body.notes
    });
    orderItem.save();
    res.redirect(req.headers.referer);
};
// [POST]/foods/{{shop_name}}/{{foodId}}/getfeedback
const giveFeedback = async function (req, res) {
    try {
        let user = req.session.authUser;
        let food = await FoodService.findById(req.body.itemId);
        const newFeedback = new Feedback({
            itemId: food._id,
            userId: user._id,
            rating: Number(req.body.rating),
            comment: req.body.comment,
            feedbackDate: req.body.feedbackDate
        });
        console.log(newFeedback);
        const savedFeedback = await newFeedback.save();
        console.log(savedFeedback);
        const foodItemId = food._id;
        await Food.findByIdAndUpdate(
            foodItemId,
            {
                $push: { feedbacks: savedFeedback._id }
            },
            { new: true, useFindAndModify: false }
        );
    } catch {}
};
export default { index, foodDetail, shop, addToCart, giveFeedback };
