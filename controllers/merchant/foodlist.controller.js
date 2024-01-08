import FoodList from "../../services/merchant/foodlist.service.js";
import Profile from "../../services/user/profile.service.js";

const index = async function (req, res) {
    try {
        const merchantId = req.session.authUser._id;
        let categoryId = req.query.categoryId;
        const merchant = await FoodList.findInfoMerchant(merchantId);

        const list_category = await Profile.getCategories();

        let categoryName;
        let categories = [];
        for(let i = 0; i< merchant.category.length; i++){
            if(merchant.category[i]._id.toString() === categoryId) categoryName = merchant.category[i].name;
            categories.push({id: merchant.category[i]._id, name: merchant.category[i].name});
        }

        if(!categoryId){
            categoryId = categories[0].id;
            categoryName = categories[0].name;
        }
        console.log(categoryId);
        console.log(categoryName);

        let foods = await Promise.all(merchant.menu.map(async (foodItem) => {
            const food = await FoodList.findInfoFood(foodItem._id);
            if (food.category.includes(categoryId)){
                return {id: food._id, image: food.image, name: food.name, rating: food.rating, category: categoryName, status:food.foodType[0].status, price: food.foodType[0].price, quantity: food.foodType[0].quantity};
            }else{
                return null;
            }
        }));
        console.log(foods);
        foods = foods.filter(food => food !== null);

        const limit = 4;
        const page = req.query.page || 1;
        const offset = (page - 1) * limit;

        const total = foods.length;
        const nPages = Math.ceil(total / limit);

        const pageNumbers = [];
        if(nPages <= 7){
            for (let i = 1; i <= nPages; i++) {
                pageNumbers.push({
                value: i,
                isActive: i === +page,
                category: categoryId
                });
            }
        }else{
            if(Number(page) + 2 <= nPages){
                if(Number(page) > 5){
                    for (let i = 1; i <= 2; i++) {
                        pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        categoryId: categoryId
                        });
                    }
                    pageNumbers.push({
                        value: '..',
                        isActive: false,
                        categoryId: categoryId
                    });
                    for (let i = Number(page) - 2; i <= Number(page) + 2; i++) {
                        pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        categoryId: categoryId
                        });
                    }  
                }else if(Number(page) > 3){
                    for (let i = Number(page) - 3; i <= Number(page) + 3; i++) {
                        pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        categoryId: categoryId
                        });
                    }    
                }else{
                    for (let i = 1; i <= 7; i++) {
                        pageNumbers.push({
                        value: i,
                        isActive: i === +page,
                        categoryId: categoryId
                        });
                    } 
                }
            }else if(Number(page) + 2 > nPages){
                for (let i = 1; i <= 2; i++) {
                    pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    categoryId: categoryId
                    });
                }
                pageNumbers.push({
                    value: '..',
                    isActive: false,
                    categoryId: categoryId
                });
                for (let i = nPages - 4; i <= nPages; i++) {
                    pageNumbers.push({
                    value: i,
                    isActive: i === +page,
                    categoryId: categoryId
                    });
                }
            }    
        }
        console.log("pagination: ", pageNumbers);

        let list = foods;
        if(total > offset){
            list = foods.slice(offset, offset+limit); 
        }

        let isFirstPage = false;
        if(Number(page) === 1) isFirstPage = true;

        let isLastPage = false;
        if(Number(page) === nPages) isLastPage = true;

        res.render("merchant/foodlist", {
            type: "products",
            list_category: list_category,
            categories: categories,
            categoryId: categoryId,
            merchantId: merchant._id,
            foods: list,
            empty: foods.length === 0,
            isFirstPage: isFirstPage,
            isLastPage: isLastPage,
            pageNumbers: pageNumbers,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteCategory = async function (req, res){
    const merchantId = req.body.merchantId;
    const categoryId = req.body.categoryId;

    console.log(categoryId);

    const merchant = await FoodList.findInfoMerchant(merchantId);

    if (!merchant) {
        console.log("Merchant not found");
        return;
    }
  
    await Promise.all(merchant.menu.map(async (foodItem) => {
        const food = await FoodList.findInfoFood(foodItem._id);
        if (food.category.includes(categoryId)){
            const categoryFoodIndex = food.category.indexOf(categoryId);
  
            if (categoryFoodIndex !== -1) {
                food.category.splice(categoryFoodIndex, 1);
          
                await food.save();
          
                console.log("Category deleted from food successfully");
            } else {
                console.log("Category not found in food's categories");
            }
        }
    }));
    

    let categoryIndex = -1;

    for(let i = 0; i<merchant.category.length; i++){
        if(merchant.category[i]._id.toString() === categoryId){
            categoryIndex = i;
            // merchant.category.splice(categoryIndex, 1);
  
            // await merchant.save();
            // res.json({ success: true, message: 'Đã xóa category thành công' });
            break;
        }
    }
  
    if (categoryIndex !== -1) {
        merchant.category.splice(categoryIndex, 1);
  
        await merchant.save();
  
        res.json({ success: true, message: 'Đã xóa category thành công' });
    } else {
        res.json({success: true, message: "Không tìm thấy category này trong danh sách category của merchant"});
    }

};

const updateCategory = async function(req, res){
    const merchantId = req.body.merchantId;
    const categories = req.body.categories;

    console.log("category: ", categories);
    const update = await FoodList.updateCategory(merchantId, categories);
    if(update){
        res.json({ success: true, message: 'Đã thêm categories thành công' });
    }else{
        res.json({ success: true, message: 'Đã xóa category thành công' });
    }
}

export default { index, deleteCategory, updateCategory };

