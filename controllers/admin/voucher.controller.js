import VoucerService from "../../services/admin/voucher.service.js";
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}
const index = async function (req, res) {
    const page = req.query.page || 1;
    const limit = 6;
    const offset = (page - 1) * limit;
    const listVoucher = await VoucerService.findAll(offset, limit);
    const extractedDataListVoucher = listVoucher.map(({ voucherId, startDate, endDate, typeVoucher }) => ({
        voucherId,
        startDate: new Date(startDate).toLocaleDateString("en-GB"),
        endDate: new Date(endDate).toLocaleDateString("en-GB"),
        typeVoucher: capitalizeFirstLetter(typeVoucher)
    }));
    const totalCount = await VoucerService.countDocuments();
    const nPages = Math.ceil(totalCount / limit);
    console.log(nPages);
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
    res.render("admin/add-voucher");
};
const addTheVoucher = async function (req, res) {
    console.log(req.body);
    res.redirect("back");
};
export default { index, add, addTheVoucher };
