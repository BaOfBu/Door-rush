import Merchant from "../../models/merchantModel.js";
export default {
    findAll() {
        return Merchant.find();
    },
    findAllActive() {
        return Merchant.find({ status: "active" });
    },
    findAllActive(offset, limit) {
        return Merchant.find({ status: "active" }).skip(offset).limit(limit);
    },
    countActive() {
        return Merchant.find({ status: "active" }).countDocuments();
    },
    countActiveByName(name) {
        const usernameRegex = new RegExp(name, "i");
        return Merchant.find({
            status: "active",
            name: { $regex: usernameRegex }
        }).countDocuments();
    },
    findActiveByName(name) {
        return Merchant.find({ name: name, status: "active" });
    },
    findActiveByCCCD(cccd) {
        return Merchant.find({ status: "active", cccd: cccd });
    },
    findPending(offset, limit) {
        return Merchant.find({ status: "pending" }).skip(offset).limit(limit);
    },
    findPendingByID(id) {
        return Merchant.findOne({ status: "pending", _id: id });
    },
    findActiveByName(name, offset, limit) {
        const usernameRegex = new RegExp(name, "i");
        return Merchant.find({
            status: "active",
            name: { $regex: usernameRegex }
        })
            .skip(offset)
            .limit(limit);
    },
    findPendingByUsername(username, offset, limit) {
        const usernameRegex = new RegExp(username, "i");
        return Merchant.find({
            status: "pending",
            username: { $regex: usernameRegex }
        })
            .skip(offset)
            .limit(limit);
    },
    findPendingByDateRange(startDate, endDate) {
        try {
            const partsStart = startDate.split("-");
            const startDateConvert = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);

            const partsEnd = endDate.split("-");
            const endDateConvert = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);

            const merchant = Merchant.find({
                timeRegister: {
                    $gte: startDateConvert,
                    $lte: endDateConvert
                },
                status: "pending"
            });
            return merchant;
        } catch (error) {
            console.error("Error in findPendingByDateRange:", error);
            throw error;
        }
    },
    findPendingByDateRange(startDate, endDate, offset, limit) {
        try {
            const partsStart = startDate.split("-");
            const startDateConvert = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);

            const partsEnd = endDate.split("-");
            const endDateConvert = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);

            const merchant = Merchant.find({
                timeRegister: {
                    $gte: startDateConvert,
                    $lte: endDateConvert
                },
                status: "pending"
            })
                .skip(offset)
                .limit(limit);
            return merchant;
        } catch (error) {
            console.error("Error in findPendingByDateRange:", error);
            throw error;
        }
    },
    findActiveByDateRange(startDate, endDate, offset, limit) {
        try {
            const partsStart = startDate.split("-");
            const startDateConvert = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);

            const partsEnd = endDate.split("-");
            const endDateConvert = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);

            const merchant = Merchant.find({
                timeRegister: {
                    $gte: startDateConvert,
                    $lte: endDateConvert
                },
                status: "active"
            })
                .skip(offset)
                .limit(limit);
            return merchant;
        } catch (error) {
            console.error("Error in findPendingByDateRange:", error);
            throw error;
        }
    },
    countPendingByUsername(username) {
        const usernameRegex = new RegExp(username, "i");
        return Merchant.countDocuments({
            status: "pending",
            username: { $regex: usernameRegex }
        });
    },
    countPendingByDate(startDate, endDate) {
        const partsStart = startDate.split("-");
        const startDateConvert = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);

        const partsEnd = endDate.split("-");
        const endDateConvert = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);
        return Merchant.find({
            timeRegister: {
                $gte: startDateConvert,
                $lte: endDateConvert
            },
            status: "pending"
        }).countDocuments();
    },
    countActiveByDate(startDate, endDate) {
        const partsStart = startDate.split("-");
        const startDateConvert = new Date(partsStart[2], partsStart[1] - 1, partsStart[0]);
        const partsEnd = endDate.split("-");
        const endDateConvert = new Date(partsEnd[2], partsEnd[1] - 1, partsEnd[0]);
        return Merchant.find({
            timeRegister: {
                $gte: startDateConvert,
                $lte: endDateConvert
            },
            status: "active"
        }).countDocuments();
    },
    countPending() {
        return Merchant.find({ status: "pending" }).countDocuments();
    },
    findById(id) {
        return Merchant.findOne({ _id: id });
    },
    updateStatusBan(id) {
        try {
            const updatedItem = Merchant.findByIdAndUpdate(id, { status: "ban" }, { new: true });
            if (!updatedItem) {
                return null;
            }
            return updatedItem;
        } catch (error) {
            console.error("Error updating the item:", error);
            throw error;
        }
    }
};
