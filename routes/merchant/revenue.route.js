import express from "express";
import revenueController from "../../controllers/merchant/revenue.controller.js";
import auth from "../../middleware/auth.mdw.js";

const router = express.Router();

router.get("/", revenueController.index);
router.post("/total", revenueController.total);
router.post("/within-month", revenueController.withinMonth);
router.post("/within-year", revenueController.withinYear);
router.post("/yearly", revenueController.yearly);

export default router;