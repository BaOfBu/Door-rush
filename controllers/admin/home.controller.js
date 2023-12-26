import Account from "../../models/accountModel.js";

const index = async function (req, res) {
    const CountByUser = await Account.countDocuments({role: "User"});
    const CountByMerchant = await Account.countDocuments({role: "Merchant"});
    res.render("admin/home", {
        type: "home",
        countUser: CountByUser,
        countMerchant: CountByMerchant
    });
};
export default { index };
