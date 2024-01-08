import { ObjectId } from "mongodb";
import Conversation from "../../models/conversationModel.js";
import Message from "../../models/messageModel.js";
import User from "../../models/userModel.js";
import Merchant from '../../models/merchantModel.js';

export default {
    async findConversationByMerchantId(merchantId) {
        var res = await Conversation.find({ merchantId: merchantId });
        var result = [];
        for (let i = 0; i < res.length; i++) {
            var user = await User.findById(res[i].userId);
            result.push({
                userId: user._id,
                username: user.username,
            });
        }
        return result;
    },
    async findConversation(userId, merchantId) {
        userId = new ObjectId(userId);
        merchantId = new ObjectId(merchantId);
        var res = await Conversation.findOne({ userId: userId, merchantId: merchantId });
        console.log(res);
        if(!res){
            console.log("not found");
            res = await Conversation.findOne({ userId: merchantId, merchantId: userId });
        }
        if (res) {
            console.log("found");
            return res;
        }
        else{
            console.log("create");
            res = Conversation.insertMany({ userId: userId, merchantId: merchantId });
            return res;
        }
    },
    addMessage(conversationId, sender, message) {
        return Message.create({ conversationId: conversationId, sender: sender, content: message });
    },
    async getMessage(conversationId) {
        const mess = await Message.find({ conversationId: conversationId }).lean();
        var result = [];
        for (let i = 0; i < mess.length; i++) {
            result.push({
                sender: mess[i].sender,
                message: mess[i].content
            });
        }
        return result;
    }
    
};