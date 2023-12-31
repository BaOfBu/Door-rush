import MerchantService from "../../services/admin/merchant.service.js";
// [GET]/admin/validate-shop?page=
const index = async function (req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const merchant = await MerchantService.findPending(offset, limit);
    const totalCount = await MerchantService.countPending();
    const nPages = Math.ceil(totalCount / limit);
    const merchantArray = merchant.map(merchant => {
        return {
            username: merchant.username,
            id: merchant._id,
            username: merchant.username,
            name: merchant.name
        };
    });
    res.render("admin/validate-shop", {
        total: totalCount,
        nPages: nPages,
        prev: Number(page) === 1 ? 0 : Number(page) - 1,
        next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
        currentPage: page,
        merchant: merchantArray,
        type: "validate-shop"
    });
};
export default { index };
