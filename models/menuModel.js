import mongoose from "mongoose"

const menuSchema = new mongoose.Schema({
    menu: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Food" 
    }],
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;