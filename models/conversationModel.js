import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 
        "Account" 
    }]
    // Thêm các trường khác nếu cần thiết
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
