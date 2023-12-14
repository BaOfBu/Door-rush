import Merchant from "../../models/merchantModel.js";

class SearchService{
    async getAllMerchant(){
        return await Merchant.findAll();
    }

    async getListMerchantDiscount(){
        const merchants = await Merchant.find({hasDiscount: "false"});
        return merchants;
    }
}

export default new SearchService();