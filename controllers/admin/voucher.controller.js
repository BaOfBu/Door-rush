import VoucherService from "../../services/admin/voucher.service.js";
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}
// [GET]/admin/voucher
const index = async function (req, res) {
    let page = req.query.page || 1;
    let text = req.query.text || "";
    let status = req.query.status || "";
    if (page == 0) page = 1;
    let search;
    if (status == "" && text == "") {
        search = false;
    } else {
        search = true;
    }
    const limit = 5;
    const offset = (page - 1) * limit;
    const listVoucher = await VoucherService.findAllWithStatusAndText(offset, limit, status, text);
    const totalCount = await VoucherService.countDocumentWithStatusText(status, text);
    const nPages = Math.ceil(totalCount / limit);
    const currentDate = new Date();
    const extractedDataListVoucher = listVoucher.map(({ _id, voucherId, startDate, endDate, typeVoucher }) => {
        const status = new Date(endDate) < currentDate ? "Hết hạn" : "Đang hoạt động";
        return {
            _id,
            voucherId,
            startDate: new Date(startDate).toLocaleDateString("en-GB"),
            endDate: new Date(endDate).toLocaleDateString("en-GB"),
            typeVoucher: capitalizeFirstLetter(typeVoucher),
            status: status
        };
    });
    res.render("admin/voucher", {
        totalCount: totalCount,
        search: search,
        nPages: nPages,
        page: page,
        prev: Number(page) === 1 ? 0 : Number(page) - 1,
        next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
        empty: extractedDataListVoucher.length == 0,
        listVoucher: extractedDataListVoucher,
        type: "voucher"
    });
};
// [GET]/admin/voucher/add
const add = async function (req, res) {
    res.render("admin/add-voucher", {
        type: "voucher"
    });
};
// [POST]/admin/voucher/add
const addTheVoucher = async function (req, res) {
    req.body.valueOfDiscount = Number(req.body.valueOfDiscount);
    req.body.startDate = new Date(req.body.startDate);
    req.body.endDate = new Date(req.body.endDate);
    await VoucherService.save(req.body);
    res.redirect("back");
};
// [GET]/admin/voucher/remove-voucher
const removeVoucher = async function (req, res) {
    const voucherId = req.query.voucherId || -1;
    await VoucherService.delete(voucherId);
    res.redirect("back");
};
// [GET]/admin/voucher/edit-voucher?id={{voucherID}}
const editVoucher = async function (req, res) {
    const id = req.query.id || -1;
    if (id == -1) {
        res.redirect("/admin/voucher");
        return;
    }
    const voucher = await VoucherService.findById(id).lean();
    voucher.startDate = formatDate(voucher.startDate);
    voucher.endDate = formatDate(voucher.endDate);
    res.render("admin/edit-voucher", {
        type: "voucher",
        voucher: voucher
    });
};
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const editVoucherDatabase = async function (req, res) {
    const id = req.query.id === undefined ? -1 : req.query.id;
    VoucherService.findAndUpdate(id, req.body);
    res.redirect("/admin/voucher/edit-voucher?id=" + id);
};
export default { index, add, addTheVoucher, removeVoucher, editVoucher, editVoucherDatabase };
