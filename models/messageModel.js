import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    content: String,
    timestamp: { type: Date, default: Date.now },
    attachment: {
        type: {
            fileType: String, 
            url: String 
        },
        default: null
    }
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
