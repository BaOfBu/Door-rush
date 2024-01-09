import Merchant from "../../models/merchantModel.js"

const findByName = (shopName) => {
    return Merchant.findOne({name: shopName})
        .populate("address category")
        .populate({path: "menu", populate: {path: "foodType category"}})
        .populate({path: "foodRecommend", populate: {path: "foodType"}})
        .exec()
}
const mergeAddress = (shop) => {
    let shopAddress = shop.address.houseNumber 
            + " Đường " + shop.address.street
            + ", " + shop.address.ward
            + ", " + shop.address.district
            + ", " + shop.address.city
    return shopAddress
}
const getAllFood = (shop) => {
    let shopFood = []
    for(let each of shop.menu){

        let price = each.foodType.map(type => {
            return new Intl.NumberFormat("vi-VN").format(type.price) + " Đ";
        });
        let category = each.category.map(type => type.name)
        let rating = Math.round(each.rating)
        shopFood.push({
            id: each._id,
            image: each.image,
            name: each.name,
            rating: rating,
            price: price[0] || (0 + " Đ"),
            category: category
        })
    }
    return shopFood
}
const getAllCategory = (shop, shopFood) => {
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
    return shopCategory
}
const sliceCategory = (shopCategory, start, end) => {
    return shopCategory.slice(start, end)
}
const getRecommendFood = (shop) => {
    let recommendFood = []
    for(let each of shop.foodRecommend){
        let price = each.foodType.map(type => {
            return new Intl.NumberFormat("vi-VN").format(type.price) + " Đ";
        });
        let rating = Math.round(each.rating)
        recommendFood.push({
            id: each._id,
            image: each.image,
            name: each.name,
            rating: rating,
            price: price[0] || (0 + " Đ"),
        })
    }
    return recommendFood
}

export default {
    findByName,
    mergeAddress,
    getAllFood,
    getAllCategory,
    sliceCategory,
    getRecommendFood
}