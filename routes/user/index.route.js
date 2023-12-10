import express from "express";
const router = express.Router();

import foodRoutes from "./food.route.js";
import contactRoutes from "./contact.route.js";
import homeRoutes from "./home.route.js";
import profileRoutes from "./profile.route.js";
import orderRoutes from "./order.route.js";

// Middleware to apply default settings to the response locals
function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "user/layouts/main";
    next();
}
router.use(setDefaultLayoutAndPartials);

router.use("/profile", profileRoutes);
router.use("/foods", foodRoutes);
router.use("/contact", contactRoutes);
router.use("/", homeRoutes);
router.use("/order", orderRoutes);

export default router;
