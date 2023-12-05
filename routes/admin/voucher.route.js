import express from "express";
import voucherController from "../../controllers/admin/voucher.controller.js";
const router = express.Router();
router.get("/", voucherController.index);
export default router;
