import Address from "../../models/addressModel.js";
import Profile from "../../services/user/profile.service.js";
import bcrypt from 'bcrypt';

const viewProfile = async function (req, res){
    const userID = req.params.userID;
    const optional = req.query.optional || "default";

    const user = await Profile.getUserInfo(userID);
    switch(optional){
        case "default":{
            const dob = user.birthdate;
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                birthdate: dob,
            });
            break;
        };
        case "address":{
            const addresses = await Profile.getUserAddresses(userID);
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
                addresses: addresses
            });
            break;
        };
        case "history":{
            let orders = await Profile.getUserOrderHistory(userID);

            let status = req.query.status || "all";
            let startDate = req.query.startDate || null;
            let endDate = req.query.endDate || null;

            let start;
            let end;

            if(startDate && endDate){
                start = new Date(startDate);
                end = new Date(endDate);
            }

            let statusFilter = status;
            if(statusFilter === "all") statusFilter = "Tất cả trạng thái";
            if(statusFilter === "pending") statusFilter = "Đang chờ";
            if(statusFilter === "preparing") statusFilter = "Đang chuẩn bị";
            if(statusFilter === "delivering") statusFilter = "Đang giao";
            if(statusFilter === "delivered") statusFilter = "Hoàn thành";
            if(statusFilter === "cancelled") statusFilter = "Đã hủy";

            if (statusFilter !== "Tất cả trạng thái") {
                if(startDate && endDate){
                    orders = orders.filter(order => {
                        let timeOrder = new Date(order.timeOrder);
                        return order.status === statusFilter &&
                        timeOrder >= start && timeOrder <= end
                    });
                }else{
                    orders = orders.filter(order => {
                        return order.status === statusFilter
                    });
                }
            }else{
                if(startDate && endDate){
                    orders = orders.filter(order => {
                        let timeOrder = new Date(order.timeOrder);
                        return timeOrder >= start && timeOrder <= end
                    });
                }
            }
            
            const limit = 4;
            const page = req.query.page || 1;
            const offset = (page - 1) * limit;

            const total = orders.length;
            const nPages = Math.ceil(total / limit);

            const pageNumbers = [];
            for (let i = 1; i <= nPages; i++) {
                pageNumbers.push({
                value: i,
                isActive: i === +page,
                statusFilter: status,
                startDate: startDate,
                endDate: endDate
                });
            }

            let list = orders;
            if(total > offset){
                list = orders.slice(offset, offset+limit); 
            }

            let isFirstPage = false;
            if(Number(page) === 1) isFirstPage = true;

            let isLastPage = false;
            if(Number(page) === nPages) isLastPage = true;

            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.image,
                orders: list,
                empty: orders.length === 0,
                isFirstPage: isFirstPage,
                isLastPage: isLastPage,
                pageNumbers: pageNumbers,
                statusFilter: statusFilter,
                startDate: startDate,
                endDate: endDate,
            });
            break;
        };
        case "register":{
            const categories = await Profile.getCategories();

            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
                categories: categories
            });
            break;
        };
        default:{
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
            });
            break;
        }
    }

}

const updateUserInformation = async function (req, res){
    const userID = req.params.userID;
    const optional = req.query.optional || "default";
    const updatedData = req.body;
    switch(optional){
        case "default":{
            const user = await Profile.getUserInfo(userID);
            const updatedUser = await Profile.updateUserInfo(userID, updatedData);
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: updatedUser.fullname,
                image: user.image,
                userName: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                birthdate: updatedUser.birthdate,
            });
            break;
        };
        case "address":{
            const user = await Profile.getUserInfo(userID);

            let i = 0;

            let addressesID = [];

            for (const address of user.addresses) {
                let addressUserFill = updatedData.address[i];
                let parts = addressUserFill.split(", ");
                let split = parts[0].split(" ");
                let rest = "";
                for (let j = 1; j < split.length; j++) {
                    rest += split[j];
                    if (j !== split.length - 1) rest += " ";
                }
                let dataAddress = {
                    houseNumber: split[0],
                    street: rest,
                    ward: parts[1],
                    district: parts[2],
                    city: parts[3],
                };

                addressesID.push(address._id);
                await Profile.updateUserAddress(address._id, dataAddress);
                i = i + 1;
            }

            for(let j = i; j < updatedData.address.length; j++){
                let addressUserFill = updatedData.address[j];
                let parts = addressUserFill.split(", ");
                let split = parts[0].split(" ");
                let rest = "";
                for (let j = 1; j < split.length; j++) {
                    rest += split[j];
                    if (j !== split.length - 1) rest += " ";
                }
                let dataAddress = new Address ({
                    houseNumber: split[0],
                    street: rest,
                    ward: parts[1],
                    district: parts[2],
                    city: parts[3],
                });

                await dataAddress.save();
                addressesID.push(dataAddress._id);
                
                const updatedUser = await Profile.updateUserInfo(userID, {addresses: addressesID});
            }

            const addresses = await Profile.getUserAddresses(userID);
            
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
                addresses: addresses
            });
            break;
        };
        case "password":{
            const raw_current_password = req.body.currentPassword;
            const user = await Profile.getUserInfo(userID);
            const ret = bcrypt.compareSync(raw_current_password, user.password);
            if (ret === false) {
                return res.render("user/profile", {
                    err_message: "Incorrectly current password."
                });
            }else{
                const raw_new_password = req.body.newPassword;
                const salt = bcrypt.genSaltSync(10);
                const hash_password = bcrypt.hashSync(raw_new_password, salt);
                const updatedUser = await Profile.updateUserInfo(userID, {password: hash_password});
                res.render("user/profile", {
                    user: true,
                    type: "profile",
                    userID: userID,
                    fullName: user.fullname,
                    image: user.image,
                    userName: user.username,
                }); 
            }
            break;
        }
        case "register":{
            const user = await Profile.getUserInfo(userID);
            await Profile.createShopRegister(user.username, user.password, updatedData);
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
            });
            break;
        };
        default:{
            res.render("user/profile", {
                user: true,
                type: "profile",
                userID: userID,
                fullName: user.fullname,
                image: user.image,
                userName: user.username,
            });
            break;
        };
    }
}
export default {viewProfile, updateUserInformation};
