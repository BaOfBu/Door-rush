import Category from "./categoryModel.js";
import Feedback from "./feedbackModel.js";
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
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    maxQuantity: {
        type: Number,
        required: true
    },
    category: Category,
    status: {
        type: String,
        enum: ["Còn hàng", "Hết hàng"]
    },
    rating: Number,
    description: String,
    ingredients: String,
    feedbacks: [Feedback]
});

const Food = moongose.model("Food", foodSchema);

export default Food;
