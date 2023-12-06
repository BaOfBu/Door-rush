import express from "express";
import foodsController from "../../controllers/user/foods.controller.js";
const router = express.Router();

router.get("/", foodsController.index);
router.get("/:shop-name", foodsController.shop);
router.get("/:shop-name/:id", foodsController.foodDetail);

export default router;

