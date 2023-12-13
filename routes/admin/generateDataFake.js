import express from "express";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Merchant from "../../models/merchantModel.js";
import Address from "../../models/addressModel.js";
import FoodType from "../../models/foodTypeModel.js";
import Food from "../../models/foodModel.js";
import Feedback from "../../models/feedbackModel.js";

const router = express.Router();

function generateAddressData() {
  const addressData = new Address ({
    houseNumber: faker.number.int({min: 1, max: 1000}),
    street: "Trần Phú",
    ward: "Phường 4",
    district: "Quận 5",
    city: "TP.HCM",
  })
  return addressData;
}

function generateFoodTypeData(){
  const maxQuant = faker.number.int({min: 1000, max: 10000});

  const foodTypeData = new FoodType ({
    product: 'Tên sản phẩm',
    price: faker.number.float({ min: 1, max: 50, precision: 0.01 }),
    quantity: faker.number.int({ min: 1, max: maxQuant }),
    maxQuantity: maxQuant,
    status: faker.helpers.arrayElement(["Còn hàng", "Hết hàng"]),
  });

  return foodTypeData;
}

async function generateFoodData(){
  var foodType = new Array();
  var feedBack = new Array();
  const numGenFoodType = 2;

  for(var i = 0; i < numGenFoodType; i++){
    const foodTypeData = await generateFoodTypeData().save();
    foodType.push(foodTypeData._id);
    const feedbackData = new Feedback ({
      itemId: foodTypeData._id,
      userId: ["6575de3d12871376fb2d1a20"],
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      comment: faker.lorem.sentence(),
      feedbackDate: faker.date.past(),
    });
    await feedbackData.save();
    feedBack.push(feedbackData._id);
  }

  const foodData = new Food ({
    image: faker.image.url(),
    name: 'Tên món ăn',
    foodType: foodType,
    rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
    description: faker.lorem.sentences(),
    feedbacks: feedBack,
    category: ["6575e8733728f10ba2eeaf49"],
  });

  await foodData.save();
  return foodData._id;
}

router.get("/generate-merchant", async function () {
  try {
      const address = await generateAddressData().save();
      var foodData = new Array();

      const numGenFood = 2;
      const numGenMerchant = 2;

      for(var i = 0; i < numGenFood; i++){
        const food = await generateFoodData();
        foodData.push(food);
      }

      for(var i = 0; i < numGenMerchant; i++){
        const fakeMerchantData = new Merchant ({
          username: faker.internet.userName(),
          password: faker.internet.password(),
          role: "Merchant",
          status: "active",
          name: "Tên quán ăn",
          representative: "Tên người đại diện",
          cccd: faker.number.int({min: 1000000000, max: 1100000000}),
          email: faker.helpers.fromRegExp("[a-z0-9]{10}@gmail\.com"),
          phone: faker.helpers.fromRegExp("0346 [0-9]{3} [0-9]{3}"),
          address: address._id,
          category: ["6575e8733728f10ba2eeaf49"],
          menu: foodData,
          revenue: 0,
          image: faker.image.url(),
          priceRange: "",
          rating: 0,
          hasDiscount: false
        });

        await fakeMerchantData.save();
        console.log("Fake Merchant data generated and saved:", fakeMerchantData);
      }
      
  } catch (error) {
      console.error("Error generating fake Merchant data:", error);
  } 
});


router.get("/find-category", async function(){
  // find({}) để tìm kiếm toàn bộ
  // select("field1 field2 ...") để chỉ lấy những field trong đối tượng mình muốn. __id và __t mặc định sẽ luôn lấy, không cần thêm vào select
  // lean() khi chỉ cần đọc dữ liệu mà không cần ghi
  // giả sử fieldOfMerchant là category, thì fieldOfCategory gồm _id và name
  // populate({path: "fieldOfMerchant", match: "fieldOfCategory: value"}) để tìm kiếm các Merchant có fieldOfMerchant chứa fieldOfCategory là value
  // nếu không có match thì mặc định sẽ tìm kiếm hết các Merchant chứa fieldOfMerchant đó. sử dụng populate khi value của field là ObjectId hoặc mảng ObjectId

  const merchants = await Merchant.find({}).select("name category").lean()
  .populate({path: "category"}).exec();

  console.log(merchants);
  
  // filter này để lọc ra những Merchant có category không phù hợp (không có field category hay có fiedl category nhưng rỗng). 
  // Phải sài vì populate sẽ trả về toàn bộ merchant, những merchant mà field không thỏa điều kiện match thì field đó sẽ thành null, hoặc không có path, field mà mình sử dụng thì nó cũng trả về 
  const filteredMerchants = merchants.filter(merchant => merchant.category); 

  filteredMerchants.forEach(filteredMerchant => {
    console.log("Merchant: ", filteredMerchant.name);
    const categories = filteredMerchant.category;
    categories.forEach(category => {
      console.log("Category : ", category.name);  
    });  
  })

});

router.get("/find-address", async function(){
    const merchants = await Merchant.find({ address: { $ne: null }}) // Tìm tất cả các merchant
    .select("name address")
    .populate({
      path: "address", // Tên trường chứa đối tượng địa chỉ trong đối tượng Merchant
      match: { 
        _id: { $ne: null},
        houseNumber: "586" }, // Điều kiện tìm kiếm trong đối tượng Address
      select: "city street houseNumber"
    }).exec();
    const filteredMerchants = merchants.filter(merchant => merchant.address !== null);
    console.log("Merchants : ", filteredMerchants);
});

export default router;