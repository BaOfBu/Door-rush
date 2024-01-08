import conversationService from "../../services/merchant/chat.service.js";

const index = async function (req, res) {
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    console.log("conversations: ",conversation);
    res.render("merchant/chat", {
        type: "chats",
        userId: req.session.authUser._id,
        conversations: conversation
    });
};

const chatHistory = async function (req, res) {
    console.log("chat history");
    const userId = req.body.conversationId;
    const merchantId = req.session.authUser._id;
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    var conversationwithUser = await conversationService.findConversation(userId, merchantId);
    var messages = await conversationService.getMessage(conversationwithUser._id);
    console.log("messages: ", messages);
    console.log("userId: ", userId);
    res.render("merchant/chat", {
        type: "chats",
        userId: req.session.authUser._id,
        conversations: conversation,
        messages: messages
    });
}
export default { index, chatHistory };
