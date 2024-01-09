import express from "express";
import foodListController from "../../controllers/merchant/foodlist.controller.js";
const router = express.Router();

router.get("/", foodListController.index);
router.post("/delete-category", foodListController.deleteCategory);
router.post("/update-category", foodListController.updateCategory);
router.post("/upload-product-image", foodListController.uploadProductImage);
router.post("/add-product", foodListController.addProduct);
router.post("/get-product", foodListController.getProduct);
router.post("/update-product", foodListController.updateProduct);
router.post("/delete-product", foodListController.deleteProduct);
export default router;
