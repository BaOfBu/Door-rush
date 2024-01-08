import express from "express";
import foodListController from "../../controllers/merchant/foodlist.controller.js";
const router = express.Router();

router.get("/", foodListController.index);
router.post("/delete-category", foodListController.deleteCategory);
router.post("/update-category", foodListController.updateCategory);

export default router;
