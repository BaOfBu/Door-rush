import Merchant from "../../models/merchantModel.js";
import Food from "../../models/foodModel.js";

class SearchService{
    async getAllMerchant(){
        return await Merchant.findAll();
    }

    async getListMerchantTopRating(){
        try {
            const topRatedMerchants = await Merchant.find({
              rating: { $gt: 4 }
            })
            .sort({ rating: -1 })
            .exec();
        
            return topRatedMerchants;
            console.log(topRatedMerchants);
          } catch (error) {
            console.error("Error fetching top-rated merchants:", error);
        }
    }
}

export default new SearchService();