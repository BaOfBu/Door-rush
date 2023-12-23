import FoodType from "../../models/foodTypeModel.js";
export default {
    findAll() {
        return FoodType.find();
    },
    findByIdForOrderItem(foodId) {
        return FoodType.findById(foodId);
    }
};
