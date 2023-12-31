import MerchantService from "../../services/admin/merchant.service.js";
// [GET]/admin/validate-shop?page=
const index = async function (req, res) {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const merchant = await MerchantService.findPending(offset, limit).populate("category");
    const totalCount = await MerchantService.countPending();
    const nPages = Math.ceil(totalCount / limit);
    const merchantArray = merchant.map((merchant, index) => {
        return {
            username: merchant.username,
            id: merchant._id,
            username: merchant.username,
            name: merchant.name,
            pageIndex: Number(offset) + Number(index) + 1,
            timeRegister: new Date(merchant.timeRegister).toLocaleDateString("en-GB"),
            categories: merchant.category.map(category => category.name).join(", ")
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
// [GET]/admin/validate-shop/:id
const detailShopValidate = async function (req, res) {
    const shopId = req.params.id;
    const previousLink = req.get("Referer") || "/default-previous-link";
    const merchantRegister = await MerchantService.findPendingByID(shopId).populate("address").populate("category").lean();
    merchantRegister.timeRegister = new Date(merchantRegister.timeRegister).toLocaleDateString("en-GB");
    merchantRegister.address =
        merchantRegister.address.houseNumber +
        ", " +
        merchantRegister.address.street +
        ", " +
        merchantRegister.address.ward +
        ", " +
        merchantRegister.address.district +
        ", " +
        merchantRegister.address.city;
    merchantRegister.category = merchantRegister.category.map(category => category.name).join(", ");
    res.render("admin/detail-validate-shop", {
        shopId: shopId,
        merchantRegister: merchantRegister,
        previousLink: previousLink
    });
};
// [GET]/admin/validate-shop/:id/checkValidate
const checkValidate = async function (req, res) {
    const merchant = await MerchantService.findActiveByName(req.query.shopName, req.query.cccd);
    if (merchant.length === 0) {
        res.json(true);
    } else {
        res.json(false);
    }
};

export default { index, detailShopValidate, checkValidate };
