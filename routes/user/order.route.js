import express from "express";
import orderController from "../../controllers/user/order.controller.js";
import auth from "../../middleware/auth.mdw.js";
const router = express.Router();

// [GET] ./order?id={{orderId}}
router.get("/",auth.authUser, orderController.index);

export default router;
