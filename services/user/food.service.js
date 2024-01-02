import Food from "../../models/foodModel.js";

export default {
    findAll() {
        return Food.find();
    },
    findByIdForOrderItem(foodId) {
        return Food.findById(foodId);
    },
    findById(foodId) {
        return Food.findById(foodId)
            .populate("foodType")
            .populate({
                path: "feedbacks",
                populate: {
                    path: "userId",
                    select: "username"
                },
                select: "comment rating feedbackDate"
            })
            .lean();
    }
};
