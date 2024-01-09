import Food from "./foodModel";

const menuSchema = new mongoose.Schema({
    menu: [Food],
});

const Menu = moongose.model("Menu", menuSchema);

export default Menu;