import express from "express";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import Category from "../../models/categoryModel.js";
import User from "../../models/userModel.js";
import Merchant from "../../models/merchantModel.js";
import Address from "../../models/addressModel.js";
import FoodType from "../../models/foodTypeModel.js";
import Food from "../../models/foodModel.js";
import Feedback from "../../models/feedbackModel.js";
import OrderItem from "../../models/orderItemModel.js";
import Order from "../../models/orderModel.js";
import Voucher from "../../models/voucherModel.js";

const router = express.Router();

const formatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});


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
  let foodType = [];
  let feedBack = [];
  const numGenFoodType = 2;

  for(let i = 0; i < numGenFoodType; i++){
    const foodTypeData = await generateFoodTypeData().save();
    foodType.push(foodTypeData._id);

    const feedbackData = new Feedback ({
      itemId: foodTypeData._id,
      userId: ["658bc732b2e15b47b4ab3653"],
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
      const numGenMerchant = 2;

      for(let i = 0; i < numGenMerchant; i++){
        const address = await generateAddressData().save();
  
        const numGenFood = 2;
        let foodData = [];

        for(let i = 0; i < numGenFood; i++){
          const food = await generateFoodData();
          foodData.push(food);
        }
  
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
          category: ["658070c464153bdfd0555006"],
          menu: foodData,
          revenue: 0,
          image: faker.image.url(),
          priceRange: "50.000Đ - 100.000Đ",
          rating: 0,
          hasDiscount: false,
          timeRegister: new Date()
        });

        await fakeMerchantData.save();
        console.log("Fake Merchant data generated and saved:", fakeMerchantData);
      }
      
  } catch (error) {
      console.error("Error generating fake Merchant data:", error);
  } 
});

function generateOrderItemData(){
  const orderItemData = new OrderItem ({
    foodId: "658bc784b2e15b47b4ab3677",
    typeFoodId: "658bc784b2e15b47b4ab366f",
    quantity: faker.number.int({min: 1, max: 5}),
    notes: faker.lorem.sentence(),
  });

  return orderItemData;
}

async function generateVoucherData(type){
  let startTime = faker.date.past();
  let endTime = faker.date.between({from: startTime, to: faker.date.recent()});

  const voucherData = new Voucher({
    voucherId: "NOELVUIVE",
    startDate: startTime,
    endDate: endTime,
    typeVoucher: type,
    valueOfDiscount: faker.number.int({min: 1, max: 10})*10000,
  });

  await voucherData.save();
  return voucherData;
}

async function generateOrderData(userID){
  const numGenOrderItem = 2;
  let orderItems = [];

  for(let i = 0; i < numGenOrderItem; i++){
    let orderItem = await generateOrderItemData().save();
    orderItems.push(orderItem._id);
  }

  let vouchers = [];

  const voucher_food = await generateVoucherData("food");
  vouchers.push(voucher_food);
  
  const temp = await Voucher.findOne({_id: voucher_food});

  const voucher_ship = await generateVoucherData("ship");
  vouchers.push(voucher_ship);

  await Voucher.findByIdAndUpdate(voucher_ship, { $set: { startDate: temp.startDate, endDate: temp.endDate } }, { new: true });

  let timeStatus = [];
  let timeOrder = faker.date.between({from: temp.startDate, to: temp.endDate});
  timeStatus.push(timeOrder);
  timeStatus.push(timeOrder.setMinutes(timeOrder.getMinutes() + 1));
  timeStatus.push(timeOrder.setMinutes(timeOrder.getMinutes() + 50));
  timeStatus.push(timeOrder.setMinutes(timeOrder.getMinutes() + 80));

  const orderData = new Order({
    merchantId: "658bc785b2e15b47b4ab3683",
    items: orderItems,
    status: faker.helpers.arrayElement(["Đang chờ", "Đang chuẩn bị", "Đang giao", "Hoàn thành", "Đã hủy"]),
    userId: userID,
    vouchers: vouchers,
    total: faker.number.int({min: 1, max: 20})*100000,
    timeStatus: timeStatus,
    addressOrder: "658bc732b2e15b47b4ab3651"
  });

  await orderData.save();

  return orderData._id;
}

router.get("/generate-user", async function(){
  try {

    let numGenUser = 1;

    for(let i = 0; i < numGenUser; i++){
      
      let numGenAddress = 1;
      let addresses = [];

      for(let i = 0; i < numGenAddress; i++){
        let address = await generateAddressData().save();
        addresses.push(address._id);
      }

      let fakeUserData = new User ({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        role: "User",
        status: "active",
        fullname: "Tên người dùng",
        email: faker.helpers.fromRegExp("[a-z0-9]{10}@gmail\.com"),
        phone: faker.helpers.fromRegExp("0346 [0-9]{3} [0-9]{3}"),
        gender: faker.helpers.arrayElement(["Nam", "Nữ", "Khác"]),
        birthdate: formatter.format(faker.date.between({from: "1950-01-01", to: "2017-01-01"})),
        addresses: addresses,
        orders: [],
        image: faker.image.avatar()
      });


      let numGenOrder = 2;
      let orders = [];

      for(let i = 0; i < numGenOrder; i++){
        let order = await generateOrderData(fakeUserData._id);
        console.log(order);
        orders.push(order);
      }

      fakeUserData.orders = orders;

      await fakeUserData.save();
      console.log("Fake User data generated and saved:", fakeUserData);
    }
      
  } catch (error) {
      console.error("Error generating fake Merchant data:", error);
  } 
})

router.get("/generate-category", async function(){
  let name = [
    "Cơm",
    "Đồ nước",
    "Đồ uống",
    "Đồ ăn nhanh",
    "Phở",
    "Hủ tiếu",
    "Bánh canh",
    "Bánh mì",
    "Bún riêu",
    "Cơm tấm",
    "Cơm niêu",
    "Cơm gà",
    "Bánh xèo",
    "Bún chả",
    "Bánh cuốn",
    "Bún thịt nướng",
    "Nem nướng",
    "Nem chua rán",
    "Bún đậu mắm tôm",
    "Gỏi cuốn",
    "Chả giò",
    "Bánh bột lọc",
    "Trà sữa",
    "Trà trái cây",
    "Nước ngọt"
  ]
  for(let i = 0; i < name.length; i++){
    const category = new Category({
      name: name[i],
    });
    await category.save();
  }

});

router.get("/find-food", async function(){
  const foods = await Food.findById({_id: "65788f9c248963c4cf34a0bb"});
  console.log(foods);
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
    console.log("Merchants : ", merchants[0].address.houseNumber);
});

export default router;