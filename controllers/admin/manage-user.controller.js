import UserService from "../../services/admin/user.service.js";
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
    const isSuccess = await UserService.deleteById(id);
    if (isSuccess.deletedCount == 1) {
        res.json(true);
    } else {
        res.json(false);
    }
};
export default { index, searchUsers, banUser };
