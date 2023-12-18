import Account from '../../models/accountModel.js';

export default {
  findByUsername(username) {
    return Account.findOne({ username: username });
  }
}