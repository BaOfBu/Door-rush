import VoucherService from "../../services/admin/voucher.service.js";
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}
const index = async function (req, res) {
    const page = req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const listVoucher = await VoucherService.findAll(offset, limit);
    const extractedDataListVoucher = listVoucher.map(({ _id, voucherId, startDate, endDate, typeVoucher }) => ({
        _id,
        voucherId,
        startDate: new Date(startDate).toLocaleDateString("en-GB"),
        endDate: new Date(endDate).toLocaleDateString("en-GB"),
        typeVoucher: capitalizeFirstLetter(typeVoucher)
    }));
    const totalCount = await VoucherService.countDocuments();
    const nPages = Math.ceil(totalCount / limit);
    res.render("admin/voucher", {
        total: totalCount,
        nPages: nPages,
        prev: Number(page) === 1 ? 0 : Number(page) - 1,
        next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
        currentPage: page,
        empty: extractedDataListVoucher.length === 0,
        listVoucher: extractedDataListVoucher,
        type: "voucher"
    });
};
const add = async function (req, res) {
    res.render("admin/add-voucher", {
        type: "voucher"
    });
};
const addTheVoucher = async function (req, res) {
    req.body.valueOfDiscount = Number(req.body.valueOfDiscount);
    req.body.startDate = new Date(req.body.startDate);
    req.body.endDate = new Date(req.body.endDate);
    await VoucherService.save(req.body);
    res.redirect("back");
};
const removeVoucher = async function (req, res) {
    const voucherId = req.query.voucherId;
    await VoucherService.delete(voucherId);
    res.redirect("back");
};
export default { index, add, addTheVoucher, removeVoucher };
