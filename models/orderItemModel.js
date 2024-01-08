import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        },
        typeFoodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FoodType"
        },
        quantity: Number,
        notes: String
    },
    { collection: "OrderItem" }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema, "OrderItem");

export default OrderItem;
