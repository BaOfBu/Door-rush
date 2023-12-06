import Category from "./categoryModel.js";
import Feedback from "./feedbackModel.js";
import FoodType from "./foodTypeModel.js";
const foodSchema = new mongoose.Schema({
    menuID: {
        type: mongoose.Schema.Types.ObjectID,
        ref: "Menu"
    },
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    foodType: {
        type: [FoodType],
        required: true
    },
    rating: Number,
    description: {
        type: String,
        required: true
    },
    feedbacks: [Feedback]
});

const Food = moongose.model("Food", foodSchema);

export default Food;
