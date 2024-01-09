import FoodService from "../../services/user/food.service.js";
import Food from "../../models/foodModel.js";
import ShopService from "../../services/user/shop.service.js";
import OrderItem from "../../models/orderItemModel.js";
import Feedback from "../../models/feedbackModel.js";
import MerchantService from "../../services/user/Merchant.service.js";
import FoodType from "../../models/foodTypeModel.js";
import OrderService from "../../services/user/order.service.js";
import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";

// [GET]/foods
const index = async function (req, res) {
    try {
        const page = req.query.page || 1;
        const limit = 8;
        const offset = (page - 1) * limit;
        const search = req.query.search || "";
        let sort = req.query.sort || "rating";
        let category = req.query.category || "All";
        let isSearch = false;
        if (sort != "rating" && search != "") {
            isSearch = true;
        }
        if (category != "All") {
            isSearch = true;
        }
        const categoryOptions = [
            "658070c464153bdfd0555006",
            "658070c464153bdfd0555008",
            "658070c464153bdfd055500a",
            "658070c464153bdfd055500c",
            "658070c464153bdfd055500e",
            "658070c464153bdfd0555010",
            "658070c464153bdfd0555012",
            "658070c464153bdfd0555014",
            "658070c464153bdfd0555016",
            "658070c464153bdfd0555018",
            "658070c464153bdfd055501a",
            "658070c464153bdfd055501c",
            "658070c564153bdfd055501e",
            "658070c564153bdfd0555020",
            "658070c564153bdfd0555022",
            "658070c564153bdfd0555024",
            "658070c564153bdfd0555026",
            "658070c564153bdfd0555028",
            "658070c564153bdfd055502a",
            "658070c564153bdfd055502c",
            "658070c564153bdfd055502e",
            "658070c564153bdfd0555030",
            "658070c564153bdfd0555032",
            "658070c564153bdfd0555034",
            "658070c564153bdfd0555036"
        ];

        const categorys = Array.isArray(category) ? category : [category];

        category === "All" ? (category = [...categoryOptions]) : (category = categorys);
        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

        let sortBy = {};
        if (sort[1]) {
            sortBy[sort[0]] = sort[1];
        } else {
            sortBy[sort[0]] = "asc";
        }

        const Merchants = await Merchant.find({
            name: { $regex: search, $options: "i" },
            status: "active"
        })
            .where("category")
            .in([...category])
            .sort(sortBy)
            .skip(offset)
            .limit(limit)
            .lean();
        console.log(Merchants);
        const total = await Merchant.countDocuments({
            category: { $in: [...category] },
            name: { $regex: search, $options: "i" },
            status: "active"
        });
        const nPages = Math.ceil(total / limit);
        let next;
        let prev;
        if (Number(page) == nPages) {
            prev = Number(page) - 1;
            next = nPages;
        } else if (Number(page) == 1) {
            prev = 1;
            next = Number(page) + 1;
        } else {
            prev = Number(page) - 1;
            next = Number(page) + 1;
        }
        const response = {
            error: false,
            total,
            page: page + 1,
            limit,
            category: categoryOptions,
            Merchants
        };
        if (next == 0) {
            next = 1;
        }
        if (Merchants.length == 0) {
            next = 1;
            prev = 1;
        }
        console.log(next);
        //res.status(200).json({ response });
        res.render("user/foods", {
            isSearch: isSearch,
            user: false,
            nPages: nPages,
            prev: prev == 0 ? 1 : prev,
            next: next,
            merchants: response.Merchants
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
};
// [GET]/foods/{{shop}}
const shop = async (req, res) => {
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

    if (!shopName) {
        return res.redirect("/");
    }
    if (!foodId) {
        return res.redirect("/shop");
    }

    const merchantId = await MerchantService.findByName(shopName);
    console.log(merchantId[0].menu);
    console.log(foodId);
    let searchString = foodId;
    let containsString = merchantId[0].menu.some(id => id.toString() === searchString);
    console.log(containsString);

    if (containsString) {
        let currentMerchant;
        let isSameMerchant = false;
        if (req.session.order != "") {
            const orderCurrent = await OrderService.findById(req.session.order);
            currentMerchant = String(orderCurrent.merchantId);
            if (currentMerchant == String(merchantId[0]._id)) {
                isSameMerchant = true;
            } else {
                isSameMerchant = false;
            }
        } else isSameMerchant = true;
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
            merchantId: String(merchantId[0]._id),
            isAccount: req.session.auth,
            isSameMerchant: isSameMerchant,
            // Data of page
            foodImg: food.image,
            foodId: foodId,
            shopName: shopName,
            foodName: foodName,
            orderId: req.session.order,
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
    } else {
        res.redirect("/foods");
    }
};
// [POST]/foods/{{shop_name}}/{{foodId}}/addToCart
const addToCart = async function (req, res) {
    if (req.body.isSameMerchant == true) {
        let foodId = await FoodService.findByIdForOrderItem(req.body.foodId);
        let foodType = await FoodType.findById(String(req.body.foodType));
        const orderItem = new OrderItem({
            foodId: foodId._id,
            typeFoodId: foodType._id,
            quantity: req.body.quantity,
            notes: req.body.notes
        });
        const orderItemMongo = await orderItem.save();
        let timeStatus = Array.from({ length: 4 }, () => null);
        // New Order in "Giỏ hàng" with userId and merchantId
        if (req.session.order === "") {
            let new_order = new Order({
                merchantId: req.body.merchantId,
                status: "Giỏ hàng",
                items: (await orderItemMongo)._id,
                userId: req.session.authUser || null,
                total: 0,
                timeStatus: timeStatus,
                addressOrder: null
            });
            const new_order_mongodb = new_order.save();
            req.session.order = (await new_order_mongodb)._id;
            req.session.numberItem = 1;
        } else {
            Order.updateOne({ _id: req.session.order }, { $push: { items: orderItemMongo._id } })
                .then(result => {
                    // console.log(result);
                })
                .catch(error => {
                    console.error("Error updating order:", error);
                });
            req.session.numberItem = req.session.numberItem + 1;
        }
        res.redirect(req.headers.referer);
    } else if (req.body.option == false) {
        res.redirect(req.headers.referer);
    } else {
        let foodId = await FoodService.findByIdForOrderItem(req.body.foodId);
        let foodType = await FoodType.findById(String(req.body.foodType));
        const orderItem = new OrderItem({
            foodId: foodId._id,
            typeFoodId: foodType._id,
            quantity: req.body.quantity,
            notes: req.body.notes
        });
        const orderItemMongo = await orderItem.save();
        const orderCurrent = await OrderService.findById(req.session.order);
        const itemOrder = orderCurrent.items;
        for (let i = 0; i < itemOrder.length; i++) {
            itemOrder[i] = String(itemOrder[i]);
        }
        let timeStatus = Array.from({ length: 4 }, () => null);
        Order.updateOne(
            { _id: req.session.order },
            {
                $set: { merchantId: req.body.merchantId, items: orderItemMongo._id }
            }
        )
            .then(result => {
                // console.log(result);
            })
            .catch(error => {
                console.error("Error updating order:", error);
            });
        OrderItem.deleteMany({ _id: { $in: itemOrder } })
            .then(result => {})
            .catch(error => {
                console.error("Error deleting items:", error);
            });
        req.session.numberItem = 1;
        res.redirect(req.headers.referer);
    }
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

const search = async function (req, res) {
    let searchValue = req.body.keyword;
    let searchResult = await MerchantService.findByKeyword(searchValue);
    res.render("user/foods.hbs", {
        user: false,
        product: searchResult
    });
};
export default { index, foodDetail, shop, addToCart, giveFeedback, search };
