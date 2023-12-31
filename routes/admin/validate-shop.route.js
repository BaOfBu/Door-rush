import express from "express";
import validateShopController from "../../controllers/admin/validate-shop.controller.js";
const router = express.Router();
router.get("/", validateShopController.index);
router.use("/:id/checkValidate", validateShopController.checkValidate);
router.get("/:id", validateShopController.detailShopValidate);

export default router;
