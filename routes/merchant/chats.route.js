import express from "express";
import manageShopController from "../../controllers/merchant/chats.controller.js";
const router = express.Router();
router.get("/", manageShopController.index);
router.post("/chat-history", manageShopController.chatHistory);
export default router;
