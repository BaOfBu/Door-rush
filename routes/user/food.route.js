import express from "express";
import foodsController from "../../controllers/user/foods.controller.js";
const router = express.Router();

router.get("/", foodsController.index);
router.get("/:shop", foodsController.shop);
router.get("/:shop/:id", foodsController.foodDetail);
router.post("/:shop/:id/getfeedback", foodsController.giveFeedback);
router.post("/:shop/:id/addToCart", foodsController.addToCart);
export default router;
