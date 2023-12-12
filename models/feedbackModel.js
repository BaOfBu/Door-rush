import mongoose from "mongoose";

const feedbackModel = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        feedbackDate: Date
    },
    { collection: "Feedback" }
);

const Feedback = mongoose.model("Feedback", feedbackModel);

export default Feedback;
