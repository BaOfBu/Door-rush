import Order from "../../models/orderModel.js";
import Merchant from "../../models/merchantModel.js";
import mongoose from "mongoose";

export default {
    findOrdersByMerchantId(merchantId){
        return Order.find({merchantId: merchantId, status: "Hoàn thành"}).populate('items').exec();
    },
    distinctUserIds(merchantId){
        return Order.distinct('userId', { merchantId: merchantId, status: "Hoàn thành" }).exec(); 
    },
    async averageMonthlyRevenue(merchantId) {
        try {
          const orders = await Order.find({ merchantId: merchantId, status: "Hoàn thành" }).sort({ 'timeStatus.3': 1 });
      
          if(orders.length === 0) return 0;

          let monthlyRevenue = new Map();
          let totalRevenue = 0;
          let totalMonths = 0;
      
          // Xác định năm đầu và năm cuối trong dữ liệu
          console.log("order: ", orders[0]);
          const startYear = orders.length > 0 && orders[0].timeStatus.length > 3 ? orders[0].timeStatus[3].getFullYear() : new Date().getFullYear();
          const startMonthOfYear = orders.length > 0 && orders[0].timeStatus.length > 3 ? orders[0].timeStatus[3].getMonth() : new Date().getMonth();
          const endYear = orders.length > 0 && orders[orders.length - 1].timeStatus.length > 3 ? orders[orders.length - 1].timeStatus[3].getFullYear() : new Date().getFullYear();
          const endMonthOfYear = orders.length > 0 && orders[orders.length -1].timeStatus.length > 3 ? orders[orders.length - 1].timeStatus[3].getMonth() : new Date().getMonth();
          // Duyệt qua mỗi tháng trong mỗi năm
          for (let year = startYear; year <= endYear; year++) {
            for (let month = 1; month <= 12; month++) {
              if(year === startYear && month - 1 < startMonthOfYear)continue;
              if(year === endYear && month > endMonthOfYear + 1)break;
              const monthKey = `${year}-${month}`;
      
              // Kiểm tra xem có đơn hàng cho tháng này hay không
              const ordersInMonth = orders.filter(order => order.timeStatus[3].getFullYear() === year && order.timeStatus[3].getMonth() === month - 1);
      
              if (ordersInMonth.length > 0) {
                let monthRevenue = ordersInMonth.reduce((sum, order) => sum + (order.total || 0), 0);
                monthlyRevenue.set(monthKey, monthRevenue);
                totalRevenue += monthRevenue;
                totalMonths++;
              } else {
                // Nếu không có đơn hàng, đặt giá trị cho tháng này là 0
                monthlyRevenue.set(monthKey, 0);
                totalMonths++;
              }
            }
          }
      
          const averageRevenue = totalMonths > 0 ? Math.round(totalRevenue / totalMonths) : 0;
      
          console.log('Monthly Revenue:', monthlyRevenue);
          console.log('Total Revenue:', totalRevenue);
          console.log('Total Months:', totalMonths);
          console.log('Average Revenue:', averageRevenue);
      
          return averageRevenue;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
    },
    findOrdersOfMerchantIdByToday(merchantId){
        const today = new Date();
        // const today = new Date("2023-07-07");
        today.setHours(0, 0, 0, 0); 

        return Order.find({merchantId: merchantId, status: "Hoàn thành", 'timeStatus.3': {
            $gte: today, // Lọc các đơn hàng từ thời điểm bắt đầu của ngày hôm nay trở đi
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // Đến thời điểm cuối cùng của ngày hôm nay
          }}).populate('items').exec();
    },
    async findOrderOfMerchantIdByTimeRange(merchantId, startDate, endDate){
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23,59,59,999);
      console.log("START DATE: ", startDate);
      console.log("END DATE: ", endDate);
      const orders = await Order.find({merchantId: merchantId, status: "Hoàn thành", 'timeStatus.3': {
          $gte: startDate,
          $lte: endDate
        }}).exec();
      console.log("ORDERS: ", orders);
      if(orders != []) console.log("Tại thời gian: ", startDate);
      return orders;
    }
};
