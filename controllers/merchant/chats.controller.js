import conversationService from "../../services/merchant/chat.service.js";
import User from "../../models/userModel.js";
import {ObjectId} from "mongodb";

const index = async function (req, res) {
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    console.log("conversations: ",conversation);
    res.render("merchant/chat", {
        type: "chats",
        userId: req.session.authUser._id,
        conversations: conversation,
        messagesHistory: "",
        receiverId: "",
        receiverName: ""
    });
};

const chatHistory = async function (req, res) {
    console.log("chat history");
    var userId = req.body.conversationId;
    const merchantId = req.session.authUser._id;
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    var conversationwithUser = await conversationService.findConversation(userId, merchantId);
    var messages = await conversationService.getMessage(conversationwithUser._id);
    var receiverName = await User.findById(userId);
    console.log("receiverName: ", receiverName);
    userId = receiverName._id.toString();
    userId = new ObjectId(userId);
    receiverName = receiverName.username;
    console.log("userId: ", userId);
    // console.log("messages: ", messages);
    // console.log("userId: ", userId);
    //console.log("userId",req.session.authUser._id)
    res.render("merchant/chat", {
        type: "chats",
        userIdTemp: userId,
        conversations: conversation,
        messagesHistory: messages,
        receiverId: userId,
        receiverName: receiverName
    });
}
export default { index, chatHistory };
