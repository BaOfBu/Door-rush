import Account from '../../models/accountModel.js'
import User from '../../models/userModel.js'

export default {
  async findByUsername(username) {
    return await Account.findOne({ username: username });
  },
  async add_user(user) {
    return await User.insertMany(user);
  },
  async findByEmail(email){
    return await User.findOne({email:email});
  }
}