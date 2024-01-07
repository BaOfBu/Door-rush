import express from "express";
import homeRoutes from "./home.route.js";
import orderListRoutes from "./orderlist.route.js";
import revenueRoutes from "./revenue.route.js";

const router = express.Router();

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "merchant/layouts/main";
    next();
}

router.use(setDefaultLayoutAndPartials);

router.use("/", homeRoutes);
router.use("/orders", orderListRoutes);
router.use("/revenue", revenueRoutes);

export default router;
