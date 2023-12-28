import VoucerService from "../../services/admin/voucher.service.js";
function capitalizeFirstLetter(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}
const index = async function (req, res) {
    const listVoucher = await VoucerService.findAll();
    const extractedDataListVoucher = listVoucher.map(({ voucherId, startDate, endDate, typeVoucher }) => ({
        voucherId,
        startDate: new Date(startDate).toLocaleDateString("en-GB"),
        endDate: new Date(endDate).toLocaleDateString("en-GB"),
        typeVoucher: capitalizeFirstLetter(typeVoucher)
    }));
    res.render("admin/voucher", {
        numberOfVoucher: extractedDataListVoucher.length,
        listVoucher: extractedDataListVoucher,
        type: "voucher"
    });
};
export default { index };
