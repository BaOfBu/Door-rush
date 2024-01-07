import shoppingCartService from "../../services/user/shopping-cart.service.js";

const displayOrder = async (req, res, next) => {
    const orderID = req.session.order;
    const userID = req.session.authUser;

    if (!userID) {
        res.redirect("/account/login");
    }
    if (!orderID) {
        res.render("user/shopping-cart", {
            user: true,
            noOrder: true
        });
    } else {
        await shoppingCartService.updateTotal(orderID);
        let orderDetail = await shoppingCartService.getOrderDetail(orderID);
        res.render("user/shopping-cart", {
            user: true,
            noOrder: false,
            orderDetail: orderDetail
        });
    }
};

const displayFoodVoucher = async (req, res, next) => {
    const searchID = req.query.voucherId;
    const voucherType = "food";
    let voucher;
    if (searchID) {
        voucher = await shoppingCartService.getActiveVoucher(voucherType, searchID);
    } else {
        voucher = await shoppingCartService.getActiveVoucher(voucherType, "");
    }
    res.render("user/voucher", {
        user: true,
        searchID: searchID,
        voucher: voucher,
        voucherType: voucherType
    });
};

const displayShipVoucher = async (req, res, next) => {
    const searchID = req.query.voucherId;
    const voucherType = "ship";
    let voucher;
    if (searchID) {
        voucher = await shoppingCartService.getActiveVoucher(voucherType, searchID);
    } else {
        voucher = await shoppingCartService.getActiveVoucher(voucherType, "");
    }
    res.render("user/voucher", {
        user: true,
        searchID: searchID,
        voucher: voucher,
        voucherType: voucherType
    });
};
const addVoucher = async (req, res, next) => {
    const orderID = req.session.order;
    const id = req.query.id;
    const type = req.query.type;
    const voucher = await shoppingCartService.findVoucherById(id);
    if (!voucher) {
        const url = "/shopping-cart/" + type + "-voucher";
        res.redirect(url);
    } else {
        let order = await shoppingCartService.getOrderVoucher(orderID);
        let hasVoucherType = false;
        for (const each of order.vouchers) {
            if (each.typeVoucher == type) {
                await shoppingCartService.deleteVoucher(each._id, orderID);
                hasVoucherType = true;
            }
        }
        if (!hasVoucherType) {
            order.vouchers.push(id);
            await order.save();
        }
        await shoppingCartService.updateTotal(orderID);
        res.redirect("/shopping-cart");
    }
};
const displayAddresss = async (req, res, next) => {
    const userID = req.session.authUser;
    if (!userID) {
        res.redirect("/account/login");
    }
    const saveAddress = await shoppingCartService.getSaveAddress(userID);
    res.render("user/address.hbs", {
        saveAddress: saveAddress,
        user: true
    });
};
const addAddress = async (req, res, next) => {
    const orderID = req.session.order;
    const address = req.query.address;
    if (!address) {
        res.redirect("/shopping-cart/address");
    } else {
        const dataAddress = shoppingCartService.formatAddress(address);
        const dbAddress = await shoppingCartService.findAddressInDatabase(dataAddress);
        let isAdd = false;
        if (!dbAddress) {
            const newAddress = await shoppingCartService.createNewAddress(dataAddress);
            isAdd = await shoppingCartService.addAddressToOrder(orderID, newAddress._id);
        } else {
            isAdd = await shoppingCartService.addAddressToOrder(orderID, dbAddress._id);
        }

        if (isAdd) {
            res.redirect("/shopping-cart");
        } else {
            res.redirect("/shopping-cart/address");
        }
    }
};
const submitOrder = async (req, res, next) => {
    const orderID = req.session.order;
    const userId = req.session.authUser;
    const order = await shoppingCartService.findOrderById(orderID);
    if (!order.addressOrder) {
        res.redirect("/shopping-cart");
    } else {
        const changeStatus = await shoppingCartService.updateStatus(orderID);
        const changeTimeStatus = await shoppingCartService.updateTimeStatus(orderID);
        const updateUserID = await shoppingCartService.updateOrderUser(userId._id, orderID);
        if (!changeStatus || !changeTimeStatus || !updateUserID) {
            res.redirect("/shopping-cart");
        } else {
            req.session.order = "";
            req.session.numberItem = 0;
            res.redirect("/order" + "?id=" + orderID);
        }
    }
};

export default {
    displayOrder,
    displayFoodVoucher,
    displayShipVoucher,
    addVoucher,
    displayAddresss,
    addAddress,
    submitOrder
};
