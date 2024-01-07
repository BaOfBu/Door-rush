import Orders from "../../services/merchant/revenue.service.js";
import OrderList from "../../services/merchant/orderlist.service.js";
import Food from "../../services/user/food.service.js";

const index = async function (req, res) {
    const merchantId = req.session.authUser._id;
    const merchantInfo = await OrderList.findMerchantInfo(merchantId);

    const startDate = merchantInfo.timeRegister;
    console.log("Start Merchant: ", startDate);
    const currentDate = new Date();
    const start = {
        day: startDate.getDay() + 1,
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear()
    };

    const current = {
        day: currentDate.getDay() + 1,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };

    res.render("merchant/revenue", {
        type: "revenue",
        merchantId: merchantId,
        startDate: start,
        currentDate: current
    });
};

const total = async function(req, res){
    const merchantId = req.body.merchantId;
    const orders = await Orders.findOrdersByMerchantId(merchantId);
    let totalRevenue = 0;
    orders.forEach(order => {
        totalRevenue += order.total;
    })

    const distinctUserIds = await Orders.distinctUserIds(merchantId);

    const averageMonthlyRevenue = await Orders.averageMonthlyRevenue(merchantId);

    let foodSales = {};

    // Lọc đơn hàng đã hoàn thành hoặc đang giao thành công
    const completedOrders = orders;

    console.log(completedOrders);

    // Duyệt qua từng đơn hàng và tính tổng số lượng của mỗi loại Food
    completedOrders.forEach(order => {
    order.items.forEach(item => {
        const foodId = item.foodId;
        if (foodSales[foodId]) {
        foodSales[foodId] += item.quantity;
        } else {
        foodSales[foodId] = item.quantity;
        }
    });
    });

    // Sắp xếp danh sách các loại Food theo số lượng bán giảm dần
    const sortedFoodSales = Object.entries(foodSales).sort((a, b) => b[1] - a[1]);

    console.log("sorted: ", sortedFoodSales);
    let foodName = "Không có";
    let quantity = -1;
    // // Lấy Food bán chạy nhất
    if(sortedFoodSales.length !== 0){
        const bestSellingFoodId = sortedFoodSales[0][0];
        console.log('foodId: ', bestSellingFoodId);
        const food =  await Food.findById(bestSellingFoodId);
        if(food){
            foodName = food.name;
        }
        quantity = sortedFoodSales[0][1];
        console.log("quantity: ", quantity);
    }

    const orderToday = await Orders.findOrdersOfMerchantIdByToday(merchantId);

    let revenueToday = 0;
    orderToday.forEach(order => {
        revenueToday += order.total;
    });
    console.log(orderToday);
    console.log("revenue-today: ", revenueToday);
    
    res.json({ success: true, totalRevenue: totalRevenue, totalOrder: orders.length, totalCustomer: distinctUserIds.length, average: averageMonthlyRevenue, hotFood: foodName, quantity: quantity, orderToday: orderToday.length, revenueToday: revenueToday });
}

const withinMonth = async function(req, res){
    const merchantId = req.body.merchantId;
    const labels = req.body.labels;
    const year = req.body.year;
    let revenueWithinMonth = [];

    for(let i = 0; i < labels.length; i++){
        let split = labels[i].split(" - ");
        let start = split[0].split("/");
        let end;
        if(split.length === 1){
            end = start;
        }else{
            end = split[1].split("/");
        }

        let startDate = year + '-' + start[1] + '-' + start[0];
        console.log("start: ", startDate);
        let endDate = year + '-' + end[1] + '-' + end[0];
        console.log("end: ", endDate);

        let orders = await Orders.findOrderOfMerchantIdByTimeRange(merchantId, new Date(startDate), new Date(endDate));
        console.log("Order time range: ", orders);
        let revenue = 0;
        orders.forEach(order => {
            revenue += order.total;
        });
        revenueWithinMonth.push(revenue);
    }

    console.log("revenue within month: ", revenueWithinMonth);
    res.json({ success: true, revenue: revenueWithinMonth});
}

function checkLeapYear(year){
    if((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)){
      return true;
    }
    return false;
}

function getDayOfMonth(month, year){
    let day = [31, 28, 31, 30, 31, 30, 31, 31, 30 , 31, 30, 31];
    if(month === 2 && checkLeapYear(year)) return 29;
    return day[month - 1];
}

const withinYear = async function(req, res){
    const merchantId = req.body.merchantId;
    const labels = req.body.labels;
    const year = req.body.year;
    let revenueWithinYear = [];

    for(let i = 0; i < labels.length; i++){
        let startDate = year + '-' + labels[i] + '-' + '01';
        console.log("start: ", startDate);
        let endDate = year + '-' + labels[i] + '-' + getDayOfMonth(labels[i], year);
        console.log("end: ", endDate);

        let orders = await Orders.findOrderOfMerchantIdByTimeRange(merchantId, new Date(startDate), new Date(endDate));
        console.log("Order time range: ", orders);
        let revenue = 0;
        orders.forEach(order => {
            revenue += order.total;
        });
        revenueWithinYear.push(revenue);
    }

    console.log("revenue within year: ", revenueWithinYear);
    res.json({ success: true, revenue: revenueWithinYear});
}

const yearly = async function(req, res){
    const merchantId = req.body.merchantId;
    const labels = req.body.labels;
    let revenueYearly = [];

    for(let i = 0; i < labels.length; i++){
        let startDate = labels[i] + '-' + '01' + '-' + '01';
        console.log("start: ", startDate);
        let endDate = labels[i] + '-' + '12' + '-' + '31';
        console.log("end: ", endDate);

        let orders = await Orders.findOrderOfMerchantIdByTimeRange(merchantId, new Date(startDate), new Date(endDate));
        console.log("Order time range: ", orders);
        let revenue = 0;
        orders.forEach(order => {
            revenue += order.total;
        });
        revenueYearly.push(revenue);
    }

    console.log("revenue yearly: ", revenueYearly);
    res.json({ success: true, revenue: revenueYearly});
}

export default { index, total, withinMonth, withinYear, yearly};
