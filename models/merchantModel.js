import mongoose from "mongoose";
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
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    menu: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        }
    ],
    foodRecommend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        }
    ],
    image: String,
    priceRange: String,
    rating: Number,
    hasDiscount: Boolean,
    statusMerchant: String
});

const Merchant = Account.discriminator("Merchant", merchantSchema);

export default Merchant;
