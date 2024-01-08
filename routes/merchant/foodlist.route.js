import express from "express";
import foodListController from "../../controllers/merchant/foodlist.controller.js";
const router = express.Router();

router.get("/", foodListController.index);
router.post("/delete-category", foodListController.deleteCategory);
router.post("/update-category", foodListController.updateCategory);
router.post("/upload-product-image", foodListController.uploadProductImage);
router.post("/add-product", foodListController.addProduct);

export default router;
