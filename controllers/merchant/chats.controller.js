import conversationService from "../../services/merchant/chat.service.js";

const index = async function (req, res) {
    var conversation = await conversationService.findConversationByMerchantId(req.session.authUser._id);
    console.log("conversations: ",conversation);
    res.render("merchant/chat", {
        type: "chats",
        userId: req.session.authUser._id,
        conversations: conversation,
    });
};

const chatHistory = async function (req, res) {
    res.render("merchant/chat", {
        type: "chats",
        
    });
}
export default { index, chatHistory };
