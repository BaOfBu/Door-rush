import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: [
            "Cơm",
            "Đồ nước",
            "Đồ uống",
            "Đồ ăn nhanh",
            "Phở",
            "Hủ tiếu",
            "Bánh canh",
            "Bánh mì",
            "Bún riêu",
            "Cơm tấm",
            "Cơm niêu",
            "Cơm gà",
            "Bánh xèo",
            "Bún chả",
            "Bánh cuốn",
            "Bún thịt nướng",
            "Nem nướng",
            "Nem chua rán",
            "Bún đậu mắm tôm",
            "Gỏi cuốn",
            "Chả giò",
            "Bánh bột lọc",
            "Trà sữa",
            "Trà trái cây",
            "Nước ngọt"
        ]
    }
},
    {collection: "Category"}
);

const Category = mongoose.model("Category", categorySchema, "Category");

export default Category;