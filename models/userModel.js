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
    birthdate: Date,
    address: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Address" 
    }],
    orders: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order" 
    }],
    image: String
});

const User = Account.discriminator("User", userSchema);

export default User;
