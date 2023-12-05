import express from "express";
import foodsController from "../../controllers/user/foods.controller.js";
const router = express.Router();
router.get("/", foodsController.index);
export default router;
