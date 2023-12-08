import Account from "./models/accountModel.js";
import Address from "./addressModel.js";
import Category from "./categoryModel.js";
import Menu from "./menuModel.js";

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
    address: Address,
    phone: String,
    category: [Category],
    menu: Menu,
    revenue: Number,
    image: String,
    priceRange: String,
    rating: Float32Array,
    hasDiscount: Boolean
});

const Merchant = Account.discriminator("Merchant", merchantSchema);

export default Merchant;
