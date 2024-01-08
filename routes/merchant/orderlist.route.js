import express from "express";
import orderListController from "../../controllers/merchant/orderlist.controller.js";
import auth from "../../middleware/auth.mdw.js";

const router = express.Router();

router.get("/", orderListController.orderList);
router.get("/:orderId", orderListController.orderDetail);
router.post("/change-order-status", orderListController.updateOrders);
router.post("/change-merchant-status", orderListController.updateStatusMerchant);

export default router;