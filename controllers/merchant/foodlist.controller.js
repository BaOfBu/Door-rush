import FoodList from "../../services/merchant/foodlist.service.js";
import Profile from "../../services/user/profile.service.js";
import multer from "multer";

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

        for(let i = 0; i<list_category.length;i++){
            for(let j = 0; j<categories.length;j++){
                if(list_category[i].name === categories[j].name) {
                    list_category.splice(i, 1);
                    i--;
                    break;
                }
            }
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/static/images/merchant/products/');
    },
    filename: function (req, file, cb) {
        const userID = req.session.authUser._id;
        const filename = userID + "_" + file.originalname;
        req.body.image = "/static/images/merchant/products/" + filename;
        console.log("filename: ", filename);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

const uploadProductImage = async function(req, res) {
    console.log("Đã vô upload");
    const userID = req.session.authUser._id;
    
    upload.single('image')(req, res, async function (err) {
        if (err) {
            console.error("error: ", err);
            return res.status(500).json({ error: 'Error during upload.' });
        } else {
            console.log("file name: ", req.body.image);
            const update = await FoodList.updateFoodInfo(req.body.foodId, { image: req.body.image });
            console.log("Đã up ảnh thành công, ", update);
            return res.json({ success: true, image: req.body.image });
        }
    });
}

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

const addProduct = async function(req, res){
    const merchantId = req.body.merchantId;
    const product = req.body.product;

    const foodId = await FoodList.addProduct(merchantId, product);
    console.log("foodId add new: ", foodId);
    if(foodId){
        res.json({ success: true, message: 'Đã thêm sản phẩm thành công', foodId: foodId});
    }else{
        res.json({ success: true, message: 'Đã xảy ra lỗi khi thêm sản phẩm' });
    }
}

export default { index, deleteCategory, updateCategory, uploadProductImage, addProduct };
