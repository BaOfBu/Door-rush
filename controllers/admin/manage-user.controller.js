import UserService from "../../services/admin/user.service.js";
import nodemailer from "nodemailer";
const index = async function (req, res) {
    let page = req.query.page || 1;
    const limit = 3;
    const totalCount = await UserService.count();
    const nPages = Math.ceil(totalCount / limit);
    if (page > nPages) page = String(nPages);
    const offset = (page - 1) * limit;
    const user = await UserService.find(offset, limit);
    const userArray = user.map((user, index) => {
        return {
            username: user.username,
            id: user._id,
            name: user.fullname,
            pageIndex: Number(offset) + Number(index) + 1,
            email: user.email
            // timeRegister: new Date(merchant.timeRegister).toLocaleDateString("en-GB"),
        };
    });
    res.render("admin/manage-user", {
        search: false,
        filter: "Tìm kiếm yêu cầu xử lý theo tài khoản",
        total: totalCount,
        nPages: nPages,
        prev: Number(page) === 1 ? 0 : Number(page) - 1,
        next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
        currentPage: page,
        user: userArray,
        type: "manage-user"
    });
}; // [GET]/admin/manage-user/search?text=""&page=""
const searchUsers = async function (req, res) {
    const text = req.query.text || "";
    const page = req.query.page || 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    const totalCount = await UserService.countByUsername(text);
    const nPages = Math.ceil(totalCount / limit);
    if (text != "") {
        const user = await UserService.findActiveByName(text, offset, limit);
        const userArray = user.map((user, index) => {
            return {
                username: user.username,
                id: user._id,
                name: user.fullname,
                pageIndex: Number(offset) + Number(index) + 1,
                email: user.email
                // timeRegister: new Date(merchant.timeRegister).toLocaleDateString("en-GB"),
            };
        });
        res.render("admin/manage-user", {
            search: true,
            isEmpty: user.length > 0 ? 0 : 1,
            filter: text,
            total: totalCount,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            user: userArray,
            type: "validate-shop"
        });
    } else {
        const user = await UserService.findPending().populate("category");
        const userArray = user.map((user, index) => {
            return {
                username: user.username,
                id: user._id,
                name: user.fullname,
                pageIndex: Number(offset) + Number(index) + 1,
                email: user.email
                // timeRegister: new Date(merchant.timeRegister).toLocaleDateString("en-GB"),
            };
        });
        res.render("admin/manage-user", {
            search: false,
            filter: "Tìm kiếm người dùng theo tài khoản",
            total: totalCount,
            isEmpty: user.length > 0 ? 0 : 1,
            nPages: nPages,
            prev: Number(page) === 1 ? 0 : Number(page) - 1,
            next: Number(page) === Number(nPages) ? 0 : Number(page) + 1,
            currentPage: page,
            user: userArray,
            type: "manage-user"
        });
    }
};
// /admin/manage-user/ban-user?userId={{this.id}}
const banUser = async function (req, res) {
    const id = req.query.userId;
    const emailMerchant = await UserService.findById(id);
    try {
        const name = emailMerchant.fullname;
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

    const isSuccess = await UserService.deleteById(id);
    if (isSuccess.deletedCount == 1) {
        res.json(true);
    } else {
        res.json(false);
    }
};
export default { index, searchUsers, banUser };
