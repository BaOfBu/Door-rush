import mongoose from "mongoose";
import Account from "./accountModel.js";

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
    birthdate: String,
    addresses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }
    ],
    image: String,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    timeRegister:{
        type: Date,
        required: true
    }
});

const User = Account.discriminator("User", userSchema);

export default User;
