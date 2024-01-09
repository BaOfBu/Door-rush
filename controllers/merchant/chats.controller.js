import conversationService from "../../services/merchant/chat.service.js";
import User from "../../models/userModel.js";
import {ObjectId} from "mongodb";

const index = async function (req, res) {
    console.log("chat:", req.session.authUser._id);
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    console.log("conversations: ",conversation);
    res.render("merchant/chat", {
        type: "chats",
        merchantId: req.session.authUser._id,
        conversations: conversation,
        messagesHistory: "",
        receiverId: "",
        receiverName: "",
        conversationId:""
    });
};

const chatHistory = async function (req, res) {
    console.log("chat history");
    var userId = req.body.conversationId;
    const merchantId = req.session.authUser._id;
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    var conversationwithUser = await conversationService.findConversation(userId, merchantId);
    var messages = await conversationService.getMessageFromMerchant(conversationwithUser._id,merchantId);
    var receiver = await User.findById(userId);
    userId = receiver._id;
    var receiverName = receiver.username;
    //console.log("userId: ", userId);
    // console.log("messages: ", messages);
    // console.log("userId: ", userId);
    //console.log("userId",req.session.authUser._id)
    //console.log("type of merchantid", typeof merchantId);
    res.render("merchant/chat", {
        type: "chats",
        merchantId: merchantId,
        conversations: conversation,
        messagesHistory: messages,
        userId: userId,
        receiverName: receiverName,
        conversationId: conversationwithUser._id
    });
}
export default { index, chatHistory };
