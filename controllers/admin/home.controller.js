import Account from "../../models/accountModel.js";

const index = async function (req, res) {
    const user = await Account.countDocuments({role: "User", status: "active"});
    const merchant = await Account.countDocuments({role: "Merchant", status: "active"});

    res.render("admin/home", {
        user: user,
        merchant: merchant,
        type: "home"
    });
};
export default { index };
