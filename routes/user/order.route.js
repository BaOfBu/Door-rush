import express from "express";
import orderController from "../../controllers/user/order.controller.js";
const router = express.Router();

// [GET] ./order?id={{orderId}}
router.get("/", orderController.index);

export default router;
