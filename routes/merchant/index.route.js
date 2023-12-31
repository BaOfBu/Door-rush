import express from "express";
const router = express.Router();

import homeRoutes from "./home.route.js";
import chatRoutes from "./chats.route.js";

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "merchant/layouts/main";
    next();
}

router.use(setDefaultLayoutAndPartials);

router.use("/", homeRoutes);
router.use("/chats", chatRoutes);

export default router;
