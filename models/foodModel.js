import mongoose from "mongoose"

const foodSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    foodType: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "FoodType" 
    }],
    rating: Number,
    description: {
        type: String,
        required: true
    },
    feedbacks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Feedback" 
    }]
});

const Food = mongoose.model("Food", foodSchema);

export default Food;
