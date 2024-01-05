import express from "express";
import orderListController from "../../controllers/merchant/orderlist.controller.js";
import auth from "../../middleware/auth.mdw.js";

const router = express.Router();

router.get("/", orderListController.orderList);
router.get("/:orderId", orderListController.orderDetail);
router.post("/change-order-status", orderListController.updateOrders);

export default router;