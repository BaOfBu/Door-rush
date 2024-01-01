import Merchant from "../../models/merchantModel.js"
import Food from "../../models/foodModel.js"
const findByName = (shopName) => {
    return Merchant.findOne({name: shopName})
        .populate("address category foodRecommend menu")
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
const findFoodByID = (foodID) => {
    return Food.findById({_id: foodID}).populate("foodType category")
}
const getAllFood = async (shop) => {
    let shopFood = []
    for(let each of shop.menu){
        let food = await findFoodByID(each._id)
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
    console.log(shopFood)
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
const findRecommendFood = (recommendID) => {
    return Food.findById({_id: recommendID}).populate("foodType")
}
const getRecommendFood = async (shop) => {
    let recommendFood = []
    for(let each of shop.foodRecommend){
        let food = await findRecommendFood(each._id)
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
    return recommendFood
}
export default {
    findByName,
    mergeAddress,
    findFoodByID,
    getAllFood,
    getAllCategory,
    sliceCategory,
    findRecommendFood,
    getRecommendFood
}