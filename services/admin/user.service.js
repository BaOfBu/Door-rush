import User from "../../models/userModel.js";
import mongoose from "mongoose";
export default {
    findAll() {
        return User.find();
    },
    findActiveByName(name) {
        return User.find({ name: name, status: "active" });
    },
    find(offset, limit) {
        return User.find({ status: "active" }).skip(offset).limit(limit);
    },
    findActiveByName(text, offset, limit) {
        const usernameRegex = new RegExp(text, "i");
        return User.find({
            status: "active",
            username: { $regex: usernameRegex }
        })
            .skip(offset)
            .limit(limit);
    },
    count() {
        return User.find({ status: "active" }).countDocuments();
    },
    findById(id) {
        return User.findOne({ _id: id });
    },
    countByUsername(username) {
        const usernameRegex = new RegExp(username, "i");
        return User.countDocuments({
            status: "active",
            username: { $regex: usernameRegex }
        });
    },
    deleteById(id) {
        const userId = new mongoose.Types.ObjectId(id);
        return User.update({ _id: userId });
    },
    updateStatusBan(id) {
        try {
            const updatedItem = User.findByIdAndUpdate(id, { status: "ban" }, { new: true });
            if (!updatedItem) {
                console.log("Item not found with id:", id);
                return null;
            }
            // console.log("Updated item:", updatedItem);
            return updatedItem;
        } catch (error) {
            console.error("Error updating the item:", error);
            throw error;
        }
    }
};
