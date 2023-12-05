import express from "express";
import manageShopController from "../../controllers/admin/manage-shop.controller.js";
const router = express.Router();
router.get("/", manageShopController.index);
export default router;
