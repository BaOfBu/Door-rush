import express from "express";
import voucherController from "../../controllers/admin/voucher.controller.js";
const router = express.Router();
router.get("/", voucherController.index);
router.get("/add", voucherController.add);
router.get("/remove-voucher", voucherController.removeVoucher);
router.post("/add", voucherController.addTheVoucher);
export default router;
