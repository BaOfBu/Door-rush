import express from "express";
import manageShopController from "../../controllers/admin/manage-shop.controller.js";
const router = express.Router();

router.get("/search", manageShopController.searchShops);
router.get("/", manageShopController.index);
router.get("/ban-shop", manageShopController.banShop);
export default router;
