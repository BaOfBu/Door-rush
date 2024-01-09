import express from "express";
const router = express.Router();

import homeRoutes from "./home.route.js";
import manageShopRoutes from "./manage-shop.route.js";
import manageUserRoutes from "./manage-user.route.js";
import validateShopRoutes from "./validate-shop.route.js";
import voucherRoutes from "./voucher.route.js";
import seedRoutes from "./generateDataFake.js";

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "admin/layouts/main";
    next();
}

router.use(setDefaultLayoutAndPartials);

router.use("/", seedRoutes);
router.use("/manage-shop", manageShopRoutes);
router.use("/manage-user", manageUserRoutes);
router.use("/validate-shop", validateShopRoutes);
router.use("/voucher", voucherRoutes);

router.use("/seeds", seedRoutes);

export default router;
