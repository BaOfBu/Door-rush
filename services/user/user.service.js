import Account from "../../models/accountModel.js";
import User from "../../models/userModel.js";
import mongoose from "mongoose";

export default {
    async findByUsername(username) {
        return await Account.findOne({ username: username }).lean();
    },
    async add_user(user) {
        return await User.insertMany(user);
    },
    async findByEmail(email) {
        return await User.findOne({ email: email });
    },
    findById(id) {
        return User.findOne({ _id: new mongoose.Types.ObjectId(id) });
    }
};
