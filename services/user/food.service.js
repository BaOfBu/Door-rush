import Food from "../../models/foodModel.js";

export default {
    findAll() {
        return Food.find();
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
