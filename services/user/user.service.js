import Account from '../../models/accountModel.js';

const add = async (userData) => {
  const user = new Account(userData);
  return user.save();
};

const findByUsername = async(username) => {
  return Account.findOne({ username: username });
};

export default {
  add,
  findByUsername
};