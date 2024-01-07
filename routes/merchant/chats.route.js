import express from "express";
import manageShopController from "../../controllers/merchant/chats.controller.js";
const router = express.Router();
router.get("/", manageShopController.index);
export default router;
