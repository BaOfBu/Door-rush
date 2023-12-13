import Food from "../../models/foodModel.js";

export default {
    findAll() {
        return Food.find();
    },
    findById(foodId) {
        return  Food.findById(foodId);
    }
};
