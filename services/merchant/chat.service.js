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
        // userId = new ObjectId(userId);
        // merchantId = new ObjectId(merchantId);
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
    async findConversationWithId(id) {
        var res = await Conversation.findById(id);
        return res;
    },
    addMessage(conversationId, sender, message, timestamp) {
        return Message.create({ conversationId: conversationId, sender: sender, content: message , timestamp: timestamp});
    },
    async getMessageFromMerchant(conversationId,merchantId) {
        console.log("get message from merchant");
        console.log("conversationId",conversationId);
        console.log("merchantId",merchantId);
        const mess = await Message.find({ conversationId: conversationId }).lean();
        var result = [];
        const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
        for (let i = 0; i < mess.length; i++) {
            var date = days[mess[i].timestamp.getDay()] + " " + mess[i].timestamp.getDate()
            +' - ' + (mess[i].timestamp.getMonth()+1) + ' - '+mess[i].timestamp.getFullYear();
            if(mess[i].sender == merchantId){
                result.push({
                    flag: true,
                    message: mess[i].content,
                    time: date
                });
            }
            else{
                result.push({
                    flag: false,
                    message: mess[i].content,
                    time: date
                });
            }
        }
        return result;
    },
    async getMessageFromUser(conversationId,userId) {
        console.log("get message from merchant");
        console.log("conversationId",conversationId);
        console.log("merchantId",userId);
        const mess = await Message.find({ conversationId: conversationId }).lean();
        var result = [];
        const days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
        for (let i = 0; i < mess.length; i++) {
            var date = days[mess[i].timestamp.getDay()] + " " + mess[i].timestamp.getDate()
            +' - ' + (mess[i].timestamp.getMonth()+1) + ' - '+mess[i].timestamp.getFullYear();
            if(mess[i].sender == userId){
                result.push({
                    flag: true,
                    message: mess[i].content,
                    time: date
                });
            }
            else{
                result.push({
                    flag: false,
                    message: mess[i].content,
                    time: date
                });
            }
        }
        return result;
    }
    
};