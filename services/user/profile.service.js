import Merchant from "../../models/merchantModel.js";
import User from "../../models/userModel.js";
import Address from "../../models/addressModel.js";

class Profile{
    async getUserOrderHistory(userID) {
        try {
            const user = await User.findById(userID)
                .select("orders")
                .lean()
                .populate({ path: "orders" })
                .exec();
    
            let infoOrders = await Promise.all(user.orders.map(async (order) => {
                let id = order._id;
                let status = order.status;
                let total = order.total;
                let timeOrder = order.timeOrder;
                
                const merchant = await Merchant.findOne({ _id: order.merchantId })
                    .select("name image address")
                    .lean()
                    .populate({ path: "address" })
                    .exec();
    
                let id_merchant = order.merchantId;
                let name_merchant = merchant.name;
                let image_merchant = merchant.image;
                let address_merchant =
                    merchant.address.houseNumber +
                    " " +
                    merchant.address.street +
                    ", " +
                    merchant.address.ward +
                    ", " +
                    merchant.address.district +
                    ", " +
                    merchant.address.city;
    
                return { id, status, total, timeOrder, id_merchant, name_merchant, image_merchant, address_merchant };
            }));
    
            return infoOrders || []; // Return an empty array if no orders found
        } catch (error) {
            console.error("Error fetching user's order history:", error);
            throw error; // Rethrow the error for higher-level handling if needed
        }
    }
    
    async getUserAddresses(userID){
        const user = await User.findById(userID)
        .select("addresses")
        .lean()
        .populate({ path: "addresses" })
        .exec();

        let addresses = [];
        let i = 1;
        user.addresses.forEach(address => {
            let index = i;
            let info = address.houseNumber +
                " " + address.street +
                ", " +
                address.ward +
                ", " +
                address.district +
                ", " +
                address.city;
            addresses.push({index, info});
            i++;
        });
        return addresses;
    }

    async getUserInfo(userID){
        try {
            const user = await User.findById(userID)
            .lean()
            .populate({ path: "addresses" })
            .exec();
                  
            return user;
        } catch (error) {
            console.error("Error fetching user's information:", error);
            throw error;  // Rethrow the error for higher-level handling if needed
        }
    }

    async updateUserInfo(userID, updatedData){
        try {
            const updatedUser = await User.findByIdAndUpdate(userID, updatedData, { new: true });
            if (!updatedUser) {
                return res.status(404).json({ error: 'Không tìm thấy người dùng' });
            }
            return updatedUser;
        } catch (error) {
          console.error('Lỗi khi cập nhật người dùng:', error);
          return res.status(500).json({ error: 'Lỗi server' });
        }
    }

    async updateUserAddress(addressID, updatedData){
        try {
            const updatedAddress = await Address.findByIdAndUpdate(addressID, updatedData, { new: true });
            if (!updatedAddress) {
                res.status(404).json({ error: 'Không tìm thấy địa chỉ' });
            }
        } catch (error) {
          console.error('Lỗi khi cập nhật địa chỉ:', error);
          res.status(500).json({ error: 'Lỗi server' });
        }
    }
    
}

export default new Profile();
