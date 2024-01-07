import express from "express";
import foodListController from "../../controllers/merchant/foodlist.controller.js";
const router = express.Router();

router.get("/", foodListController.index);
export default router;
