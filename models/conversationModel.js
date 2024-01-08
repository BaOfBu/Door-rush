import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    merchantId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 
        "Account" 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 
        "Account" 
    },
    // Thêm các trường khác nếu cần thiết
},
    {collection: "Conversation"}
);

const Conversation = mongoose.model("Conversation", conversationSchema, "Conversation");

export default Conversation;