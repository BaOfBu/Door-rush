import express from "express";
import homeRoutes from "./home.route.js";
import chatRoutes from "./chats.route.js";
import orderListRoutes from "./orderlist.route.js";
const router = express.Router();

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "merchant/layouts/main";
    next();
}

router.use(setDefaultLayoutAndPartials);

router.use("/", homeRoutes);
router.use("/chats", chatRoutes);
router.use("/orders", orderListRoutes);


export default router;
