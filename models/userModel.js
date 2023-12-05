import Account from "./accountModel.js";
import Address from "./models/addressModel.js";

const userSchema = new mongoose.Schema({
    fullname: String,
    email: {
        type: String,
        required: true
    },
    phone: String,
    gender: {
        type: String,
        enum: ["Nam", "Nữ", "Khác"]
    },
    birthdate: Date,
    address: [Address],
    orders: [orderSchema],
    image: String
});

const User = Account.discriminator("User", userSchema);

export default User;
