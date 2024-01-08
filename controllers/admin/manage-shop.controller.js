import MerchantService from "../../services/admin/merchant.service.js";
import OrderService from "../../services/admin/order.service.js";
import nodemailer from "nodemailer";
// [GET]/admin/manage-shop?page=..
const index = async function (req, res) {
    let page = req.query.page || 1;
    const limit = 3;
    const totalCount = await MerchantService.countActive();
    const nPages = Math.ceil(totalCount / limit);
    if (Number(page) > nPages) {
        res.redirect("/admin/manage-shop?page=" + nPages);
    }
    const offset = (page - 1) * limit;
    const merchant = await MerchantService.findAllActive(offset, limit).populate("address");
    const merchantArray = [];

    for (let i = 0; i < merchant.length; i++) {
        const orders = await OrderService.findAllOrderOfMerchant(merchant[i]._id);
        const sumOfOrders = orders.reduce((accumulator, order) => {
            return accumulator + order.total;
        }, 0);
        merchantArray.push({
            id: merchant[i]._id,
            name: merchant[i].name,
            pageIndex: Number(offset) + i + 1,
            timeRegister: new Date(merchant[i].timeRegister).toLocaleDateString("en-GB"),
            address: `${merchant[i].address.houseNumber} ${merchant[i].address.street}, ${merchant[i].address.ward}, ${merchant[i].address.district}, ${merchant[i].address.city}`,
            profit: sumOfOrders
        });
    }
    res.render("admin/manage-shop", {
        search: false,
        filter: "Tìm kiếm yêu cầu xử lý theo tài khoản",
        total: totalCount,
        nPages: nPages,
        prev: Number(page) === 1 ? 0 : Number(page) - 1,
        next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
        currentPage: page,
        merchant: merchantArray,
        type: "manage-shop"
    });
};
// [GET]/admin/ban-shop?id=
const banShop = async function (req, res) {
    let id = req.query.id;
    const emailMerchant = await MerchantService.findById(id);
    console.log(emailMerchant);
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
                  <p class="apology">Chúng tôi nhận thấy được tài khoản bạn đã vi phạm một số quy định của nên tảng chúng tôi nên tài khoản bạn hiện tại đang bị tạm khóa.</p>
                  <p>Vui lòng kiểm tra lại hoạt động.</p>
                  <p class="apology">Liên hệ chúng tôi để biết thêm chi tiết</p>
                  <p  class="apology"> Số điện thoại: </p>
                  <p  class="apology"> Email: </p>
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
    const merchantUpdate = await MerchantService.updateStatusBan(id);
    if (!merchantUpdate || !emailMerchant) {
        res.json(false);
    }
    res.json(true);
};
// [GET]/admin/manage-shop/search?text=""&page=""
const searchShops = async function (req, res) {
    const startDate = req.query.dateStart || "";
    const endDate = req.query.dateEnd || "";
    const text = req.query.text || "";
    const page = req.query.page || 1;
    const limit = 1;
    const offset = (page - 1) * limit;
    if (text != "") {
        const totalCount = await MerchantService.countActiveByName(text);
        const nPages = Math.ceil(totalCount / limit);
        const merchant = await MerchantService.findActiveByName(text, offset, limit).populate("address");
        const merchantArray = [];
        for (let i = 0; i < merchant.length; i++) {
            const orders = await OrderService.findAllOrderOfMerchant(merchant[i]._id);
            const sumOfOrders = orders.reduce((accumulator, order) => {
                return accumulator + order.total;
            }, 0);
            merchantArray.push({
                id: merchant[i]._id,
                name: merchant[i].name,
                pageIndex: Number(offset) + i + 1,
                timeRegister: new Date(merchant[i].timeRegister).toLocaleDateString("en-GB"),
                address: `${merchant[i].address.houseNumber} ${merchant[i].address.street}, ${merchant[i].address.ward}, ${merchant[i].address.district}, ${merchant[i].address.city}`,
                profit: sumOfOrders
            });
        }
        res.render("admin/manage-shop", {
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
            type: "manage-shop"
        });
    } else if (startDate == "" && endDate == "") {
        const totalCount = await MerchantService.countActiveByName(text);
        const nPages = Math.ceil(totalCount / limit);
        const merchant = await MerchantService.findAllActive().populate("address");
        const merchantArray = [];
        for (let i = 0; i < merchant.length; i++) {
            const orders = await OrderService.findAllOrderOfMerchant(merchant[i]._id);
            const sumOfOrders = orders.reduce((accumulator, order) => {
                return accumulator + order.total;
            }, 0);
            merchantArray.push({
                id: merchant[i]._id,
                name: merchant[i].name,
                pageIndex: Number(offset) + i + 1,
                timeRegister: new Date(merchant[i].timeRegister).toLocaleDateString("en-GB"),
                address: `${merchant[i].address.houseNumber} ${merchant[i].address.street}, ${merchant[i].address.ward}, ${merchant[i].address.district}, ${merchant[i].address.city}`,
                profit: sumOfOrders
            });
        }
        res.render("admin/manage-shop", {
            date: false,
            search: false,
            filter: "Tìm kiếm yêu cầu xử lý theo tài khoản",
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            merchant: merchantArray,
            type: "manage-shop"
        });
    } else if (startDate != "" && endDate != "") {
        const totalCount = await MerchantService.countActiveByDate(startDate, endDate);
        const nPages = Math.ceil(totalCount / limit);
        const merchantDate = await MerchantService.findActiveByDateRange(startDate, endDate, offset, limit).populate("address");
        const merchantArray = [];
        for (let i = 0; i < merchantDate.length; i++) {
            const orders = await OrderService.findAllOrderOfMerchant(merchantDate[i]._id);
            const sumOfOrders = orders.reduce((accumulator, order) => {
                return accumulator + order.total;
            }, 0);
            merchantArray.push({
                id: merchantDate[i]._id,
                name: merchantDate[i].name,
                pageIndex: Number(offset) + i + 1,
                timeRegister: new Date(merchantDate[i].timeRegister).toLocaleDateString("en-GB"),
                address: `${merchantDate[i].address.houseNumber} ${merchantDate[i].address.street}, ${merchantDate[i].address.ward}, ${merchantDate[i].address.district}, ${merchantDate[i].address.city}`,
                profit: sumOfOrders
            });
        }
        res.render("admin/manage-shop", {
            date: true,
            search: true,
            isEmpty: merchantDate.length > 0 ? 0 : 1,
            filter: text,
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            merchant: merchantArray,
            type: "manage-shop"
        });
    }
};
export default { index, banShop, searchShops };
