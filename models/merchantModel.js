import mongoose from "mongoose"
import Account from "./accountModel.js";

const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    representative: {
        type: String,
        required: true
    },
    cccd: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Address" 
    },
    category: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Category" 
    }],
    menu: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Food" 
    }],
    revenue: Number,
    image: String,
    priceRange: String,
    rating: Number,
    hasDiscount: Boolean
}, {collection: "Merchant"});

const Merchant = Account.discriminator("Merchant", merchantSchema, "Merchant");

export default Merchant;
