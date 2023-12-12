import mongoose from "mongoose"

const menuSchema = new mongoose.Schema({
    menu: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Food" 
    }],
},
    {collection: "Menu"}
);

const Menu = mongoose.model("Menu", menuSchema, "Menu");

export default Menu;