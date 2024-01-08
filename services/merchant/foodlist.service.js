import Food from "../../models/foodModel.js";
import Merchant from "../../models/merchantModel.js";
import Category from "../../models/categoryModel.js";
import mongoose from "mongoose";

export default {
    findInfoMerchant(merchantId){
        return Merchant.findById(merchantId).select('category menu').populate('menu category').exec();
    },
    findInfoFood(foodId){
        return Food.findById(foodId).select('image name foodType rating description category').populate('foodType').exec();
    },
    async updateCategory(merchantId, categories){
        let promises = categories.split(", ").map(async (category) => {
            let tmp = await Category.findOne({ name: category });
            if (tmp) {
                return tmp._id;
            } else {
                throw new Error(`Category not found: ${category}`);
            }
        });

        let categories_all = [];

        let categories_update = await Promise.all(promises);

        let merchantInfo = await Merchant.findById(merchantId).select('category menu').populate('menu category').exec();

        for(let i = 0; i < merchantInfo.category.length; i++){
            categories_all.push(merchantInfo.category[i]._id);
        }

        console.log("origin: ", categories_all);
        for(let i = 0; i < categories_update.length; i++){
            categories_all.push(categories_update[i]);
        }

        console.log("categories: ", categories_all);

        const merchant = await Merchant.findByIdAndUpdate(merchantId, {category: categories_all}, {new: true}).exec();
        // merchant.save();
        return true;
    }
};
