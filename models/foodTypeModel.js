import mongoose from "mongoose";

const foodTypeSchema = new mongoose.Schema({
    product: {
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
    status: {
        type: String,
        enum: ["Còn hàng", "Hết hàng"],
        required: true
    },
});

const FoodType = moongose.model("FoodType", foodTypeSchema);

export default FoodType;
