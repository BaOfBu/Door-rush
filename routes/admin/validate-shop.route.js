import express from "express";
import validateShopController from "../../controllers/admin/validate-shop.controller.js";
const router = express.Router();
router.get("/", validateShopController.index);
export default router;
