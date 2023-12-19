import FoodService from "../../services/user/food.service.js";
import Feedback from "../../models/feedbackModel.js";
import User from "../../models/userModel.js";
import Food from "../../models/foodModel.js";
import Merchant from "../../models/merchantModel.js"
import e from "express";

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
    const shopName = req.params.shop || 0
    console.log(shopName)

    // Handle the problem
    if(!shopName){
        return redirect("/foods")
    }

    // Get the data of shop
    let shop = await Merchant.findOne({name: shopName})
    .populate("address category foodRecommend menu")
    .exec()

    const shopEmail = shop.email
    const shopPhone = shop.phone
    const shopImage = shop.image
    const shopRating = Math.round(shop.rating)
    let shopAddress = shop.address.houseNumber 
                + " Đường " + shop.address.street
                + ", " + shop.address.ward
                + ", " + shop.address.district
                + ", " + shop.address.city

    let shopFood = []
    for(let each of shop.menu){
        let food = await Food.findById({_id: each._id}).populate("foodType category")
        let price = food.foodType.map(type => type.price)
        let category = food.category.map(type => type.name)
        let rating = Math.round(each.rating)
        shopFood.push({
            id: each._id,
            image: each.image,
            name: each.name,
            rating: rating,
            price: price[0],
            category: category
        })
    }

    let shopCategory = []
    for(let each of shop.category){
        let foods = []
        for(let each2 of shopFood){
            if(each2.category.includes(each.name)){
                foods.push(each2)
            }
        }
        let quantity = foods.length
        shopCategory.push({
            name: each.name,
            foods: foods,
            quantity: quantity
        })
    }
    shopCategory.sort((a,b) => b.quantity - a.quantity)
    let popularCategory = shopCategory
    popularCategory.slice(0, 9)

    let recommendFood = []
    for(let each of shop.foodRecommend){
        let food = await Food.findById({_id: each._id}).populate("foodType")
        let price = food.foodType.map(type => type.price)
        let rating = Math.round(each.rating)
        recommendFood.push({
            id: each._id,
            image: each.image,
            name: each.name,
            rating: rating,
            price: price[0]
        })
    }
    
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
        // shopFood: shopFood,
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
