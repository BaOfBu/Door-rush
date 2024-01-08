import Account from "../../models/accountModel.js";
import User from "../../models/userModel.js";
import mongoose from "mongoose";

export default {
  async findByUsername(username) {
    return await Account.findOne({ username: username });
  },
  async add_user(user) {
    return await User.insertMany(user);
  },
  async findByEmail(email){
    return await User.findOne({email:email});
  },
  async updateOne(email, password) {
    console.log(password);
    return await Account.findOneAndUpdate(
      { email },
      { $set: { password: password } },
      { new: true }
    );
  },
  findById(id) {
    return User.findOne({ _id: new mongoose.Types.ObjectId(id) });
  }
}