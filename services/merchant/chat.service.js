import { ObjectId } from "mongodb";
import Conversation from "../../models/conversationModel.js";
import Message from "../../models/messageModel.js";
import e from "express";

export default {
    findConversationByMerchantId(merchantId) {
        return Conversation.findOne({ merchantId: merchantId });
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
    }
    
};