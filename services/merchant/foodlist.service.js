import Food from "../../models/foodModel.js";
import Merchant from "../../models/merchantModel.js";
import Category from "../../models/categoryModel.js";
import FoodType from "../../models/foodTypeModel.js";
import mongoose from "mongoose";

export default {
    findInfoMerchant(merchantId){
        return Merchant.findById(merchantId).select('category menu').populate('menu category').exec();
    },
    findInfoFood(foodId){
        return Food.findById(foodId).select('image name foodType rating description category').populate('foodType').exec();
    },
    findInfoImageFood(foodId){
        return Food.findById(foodId).select('image').exec();
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

        // console.log("origin: ", categories_all);
        for(let i = 0; i < categories_update.length; i++){
            categories_all.push(categories_update[i]);
        }

        // console.log("categories: ", categories_all);

        const merchant = await Merchant.findByIdAndUpdate(merchantId, {category: categories_all}, {new: true}).exec();
        // merchant.save();
        return true;
    },
    async updateFoodInfo(foodId, updatedData){
        try {
            const updatedMerchant = await Food.findByIdAndUpdate(foodId, updatedData, { new: true });
            if (!updatedMerchant) {
                return res.status(404).json({ error: 'Không tìm thấy food' });
            }
            return updatedMerchant;
        } catch (error) {
          console.error('Lỗi khi cập nhật food:', error);
        //   return res.status(500).json({ error: 'Lỗi server' });
        }
    },
    async addProduct(merchantId, product){
        let promises = product.category.split(", ").map(async (category) => {
            let tmp = await Category.findOne({ name: category });
            if (tmp) {
                return tmp._id;
            } else {
                throw new Error(`Category not found: ${category}`);
            }
        });

        product.category = await Promise.all(promises);
        // console.log("Product: ", product);
        
        let foodTypeId = [];
        for(let i = 0; i<product.foodType.length;i++){
            let foodType = new FoodType(product.foodType[i]);
            await foodType.save();
            if(foodType) foodTypeId.push(foodType);
        }

        const food = new Food({
            name: product.name,
            category: product.category,
            description: product.description,
            foodType: foodTypeId,
            rating: 0,
            image: "123",
        })
        
        await food.save();

        try {
            const savedFood = await food.save();
            const savedFoodId = savedFood._id;
            if(savedFood){
                try {
                    const updatedMerchant = await Merchant.findByIdAndUpdate(
                      merchantId,
                      { $addToSet: { menu: food } },
                      { new: true }
                    );
                    return savedFoodId;
                    // console.log('Updated Merchant:', updatedMerchant);
                  } catch (error) {
                    console.error('Error:', error);
                }    
            }
            console.log('Saved Food _id:', savedFoodId);
        } catch (error) {
            console.error('Error saving food:', error);
        }
    },
    async updateProduct(merchantId, product){
        let promises = product.category.split(", ").map(async (category) => {
            let tmp = await Category.findOne({ name: category });
            if (tmp) {
                return tmp._id;
            } else {
                throw new Error(`Category not found: ${category}`);
            }
        });

        product.category = await Promise.all(promises);
        // console.log("Product: ", product);
        
        let foodTypeId = [];
        for(let i = 0; i<product.foodType.length;i++){
            if(product.foodType[i].id === -1){
                console.log("Không có food item: ", product.foodType[i].product);
                let foodType = new FoodType(product.foodType[i]);
                await foodType.save();
                if(foodType) foodTypeId.push(foodType);
            }else{
                console.log("Đã có food item: ", product.foodType[i].product);
                foodTypeId.push(product.foodType[i].id);
            }
        }

        const food = {
            _id: product.id,
            name: product.name,
            category: product.category,
            description: product.description,
            foodType: foodTypeId,
            rating: 0,
            image: product.image,
        }

        
        try {
            try {
                const merchant = await Merchant.findById(merchantId).populate('menu').exec();
                for(let i = 0; i<merchant.menu.length;i++){
                    if(merchant.menu[i]._id == food._id){
                        
                        const updatedFood = await Food.findByIdAndUpdate(food._id, food);
                        console.log("updatedFood: ", updatedFood);
                        return updatedFood;
                    }else{
                        console.log("merchant: " + merchant.menu[i]._id + " khac " + food._id);
                    }
                }
              } catch (error) {
                console.error('Error:', error);
            }
            return null;    
        } catch (error) {
            console.error('Error update food:', error);
        }
    },
    async getProduct(merchantId, productId){
        const merchant = await Merchant.findById(merchantId).populate('menu', 'name image category description foodType').exec();

        if (!merchant) {
            throw new Error('Merchant not found');
          }
      
        console.log("productId: ", productId);
        // Tìm món ăn trong menu của người bán hàng với foodId cụ thể
        const foodInMenu = merchant.menu.find(food => food._id.equals(productId));

        console.log("foodInMenu: ", foodInMenu);
        if (!foodInMenu) {
            throw new Error('Food not found in the menu');
        }

        let foodType = [];

        let categories = "";

        for(let j = 0; j < foodInMenu.category.length; j++){
            let category = await Category.findById(foodInMenu.category[j]);
            if(j === 0) {
                categories = category.name;
            }else{
                categories = categories + ', ' + category.name;
            }
        }

        for(let i = 0;i < foodInMenu.foodType.length ; i++){
            let fType = await FoodType.findById(foodInMenu.foodType[i]).exec();
            let temp = {
                id: fType._id,
                product: fType.product,
                maxQuantity: fType.maxQuantity,
                quantity: fType.quantity,
                status: fType.status,
                price: fType.price
            }
            foodType.push(temp);
        }

        console.log("foodType: ", foodType);
        const foodInfo = {
            id: foodInMenu._id,
            name: foodInMenu.name,
            image: foodInMenu.image,
            category: categories,
            description: foodInMenu.description,
            foodType: foodType
        }


        return foodInfo;
    },
    async deleteProduct(merchantId, product){
        const merchant = await Merchant.findById(merchantId);

        if (!merchant) {
            console.log('Merchant not found');
            return;
        }

        // Lọc và xóa food từ menu dựa trên foodId
        merchant.menu = merchant.menu.filter(food => !food.equals(product.id));

        // Lưu lại merchant sau khi xóa food
        await merchant.save();
        console.log("Đã xóa: ", productId);
    }
};
