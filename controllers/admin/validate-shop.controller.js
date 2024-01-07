import MerchantService from "../../services/admin/merchant.service.js";
import Merchant from "../../models/merchantModel.js";
import nodemailer from "nodemailer";
// [GET]/admin/validate-shop?page=
const index = async function (req, res) {
    const page = req.query.page || 1;
    const limit = 2;
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
        search: false,
        filter: "Tìm kiếm yêu cầu xử lý theo tài khoản",
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
    const merchant_name = await MerchantService.findActiveByName(req.query.shopName);
    const merchant_cccd = await MerchantService.findActiveByCCCD(req.query.cccd);
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // const isValid = emailRegex.test(req.query.email);
    if (merchant_name.length == 0 && merchant_cccd.length == 0) {
        const updatedMerchant = await Merchant.findOneAndUpdate({ _id: req.params.id }, { $set: { status: "active" } }, { new: true });
        res.json(true);
    } else {
        res.json(false);
    }
};
// [GET]/admin/validate-shop/:id/refuseValidate
const refuseValidate = async function (req, res) {
    const emailMerchant = await MerchantService.findById(req.params.id);
    try {
        const name = emailMerchant.representative;
        const mailOptions = {
            from: "ntson21@clc.fitus.edu.vn",
            to: emailMerchant.email,
            subject: "Thông báo từ Door Rush",
            html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                  }
                  .container {
                    max-width: 600px;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h2 {
                    color: #4285f4;
                  }
                  p {
                    line-height: 1.6;
                  }
                  .apology {
                    
                  }
                  .signature {
                    margin-top: 20px;
                    text-align: right;
                    font-style: italic;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h2>Xin chào ${name},</h2>
                  <p class="apology">Chúng tôi rất xin lỗi vì đơn yêu cầu tham gia kinh doanh của bạn không thể được chấp nhận.</p>
                  <p>Vui lòng kiểm tra lại thông tin và thử lại.</p>
                  <p class="apology">Chân thành xin lỗi vì sự bất tiện này.</p>
                  <div class="signature">
                    <p>Trân trọng,</p>
                    <p>Door Rush Team</p>
                  </div>
                </div>
              </body>
            </html>
          `
        };
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ntson21@clc.fitus.edu.vn",
                pass: "Ntson2101296773776"
            }
        });
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
    }
    const result = await Merchant.deleteOne({ _id: req.params.id });
    res.json(true);
};
// [GET]/admin/validate-shop/search?text=""&page=""
const searchShops = async function (req, res) {
    const startDate = req.query.dateStart || "";
    const endDate = req.query.dateEnd || "";
    const text = req.query.text || "";
    const page = req.query.page || 1;
    const limit = 1;
    const offset = (page - 1) * limit;
    if (text != "") {
        const totalCount = await MerchantService.countPendingByUsername(text);
        const nPages = Math.ceil(totalCount / limit);
        const merchant = await MerchantService.findPendingByUsername(text, offset, limit).populate("category");
        const merchantArray = merchant.map((merchant, index) => {
            return {
                username: merchant.username,
                id: merchant._id,
                username: merchant.username,
                name: merchant.name,
                prev: Number(page) === 1 ? 0 : Number(page) - 1,
                next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
                pageIndex: Number(offset) + Number(index) + 1,
                timeRegister: new Date(merchant.timeRegister).toLocaleDateString("en-GB"),
                categories: merchant.category.map(category => category.name).join(", ")
            };
        });
        res.render("admin/validate-shop", {
            date: false,
            search: true,
            isEmpty: merchant.length > 0 ? 0 : 1,
            filter: text,
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            merchant: merchantArray,
            type: "validate-shop"
        });
    } else if (startDate == "" && endDate == "") {
        const totalCount = await MerchantService.countPendingByUsername(text);
        const nPages = Math.ceil(totalCount / limit);
        const merchant = await MerchantService.findPending().populate("category");
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
            date: false,
            search: false,
            filter: "Tìm kiếm yêu cầu xử lý theo tài khoản",
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            merchant: merchantArray,
            type: "validate-shop"
        });
    } else if (startDate != "" && endDate != "") {
        const totalCount = await MerchantService.countPendingByDate(startDate, endDate);
        const nPages = Math.ceil(totalCount / limit);
        const merchantDate = await MerchantService.findPendingByDateRange(startDate, endDate, offset, limit).populate("category");
        const merchantArray = merchantDate.map((merchantDate, index) => {
            return {
                username: merchantDate.username,
                id: merchantDate._id,
                username: merchantDate.username,
                name: merchantDate.name,
                prev: Number(page) === 1 ? 0 : Number(page) - 1,
                next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
                pageIndex: Number(offset) + Number(index) + 1,
                timeRegister: new Date(merchantDate.timeRegister).toLocaleDateString("en-GB"),
                categories: merchantDate.category.map(category => category.name).join(", ")
            };
        });
        res.render("admin/validate-shop", {
            date: true,
            search: true,
            isEmpty: merchantDate.length > 0 ? 0 : 1,
            filter: "",
            date: true,
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            merchant: merchantArray,
            type: "validate-shop"
        });
    }
};
export default { index, detailShopValidate, checkValidate, refuseValidate, searchShops };
