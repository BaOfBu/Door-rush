import Merchant from "../../models/merchantModel.js";
import User from "../../models/userModel.js";
import Address from "../../models/addressModel.js";
import Order from "../../models/orderModel.js";
import Category from "../../models/categoryModel.js";

class Profile{
    async getCategories(){
        try {
            const categories = await Category.find()
            .lean()
            .exec();
                  
            let info = [];
            categories.forEach(category => {
                let name = category.name;
                info.push({name});
            });

            return info;
        } catch (error) {
            console.error("Error fetching categories' information:", error);
            throw error;  // Rethrow the error for higher-level handling if needed
        }
    }

    async countQuantityItemsOfOrder(orderID){
        try {
            const order = await Order.findById(orderID)
            .lean()
            .populate({ path: "items" })
            .exec();
            
            let quantity = 0;

            order.items.forEach(item => {
                quantity += item.quantity;
            });

            return quantity;
        } catch (error) {
            console.error("Error fetching order's information:", error);
            throw error;  // Rethrow the error for higher-level handling if needed
        }
    }

    async getUserOrderHistory(userID) {
        try {
            const user = await User.findById(userID)
                .select("orders")
                .lean()
                .populate({ path: "orders" })
                .exec();
    
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            };

            let infoOrders = await Promise.all(user.orders.map(async (order) => {
                let id = order._id;
                let status = order.status;
                let total = order.total;
                console.log(order.timeStatus);
                
                let timeOrder = order.timeStatus[0].toLocaleDateString('en-US', options);
                
                let quantity = await this.countQuantityItemsOfOrder(id);

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
    
                return { id, status, total, timeOrder, quantity, id_merchant, name_merchant, image_merchant, address_merchant };
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

    async createShopRegister(username, password, info){
        let categories = [];

        let tmp = await Category.findOne({name: info.type});

        categories.push(tmp._id);

        let split = info.address.split(", ");

        let tmp2 = split[0].split(" ");
        let houseNumber = tmp2[0];

        let street = "";
        for(let i = 1; i < tmp2.length; i++){
            street += tmp2[i];
            if(i != tmp2.length - 1) street += " ";
        }

        let ward = split[1];
        let district = split[2];
        let city = split[3];

        let address = new Address({
            houseNumber: houseNumber,
            street: street,
            ward: ward,
            district: district,
            city: city,
        });

        await address.save();

        const merchant = new Merchant({
            username: username,
            password: password,
            role: "Merchant",
            status: "pending",
            name: info.name,
            representative: info.representative,
            cccd: info.cccd,
            email: info.email,
            phone: info.phone,
            address: address._id,
            category: categories
        });

        await merchant.save();      
        return merchant;
    }
    
}

export default new Profile();
