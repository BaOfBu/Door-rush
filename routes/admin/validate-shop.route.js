import express from "express";
import validateShopController from "../../controllers/admin/validate-shop.controller.js";
const router = express.Router();

router.get("/search", validateShopController.searchShops);

router.get("/:id", validateShopController.detailShopValidate);
router.get("/:id/checkValidate", validateShopController.checkValidate);
router.get("/:id/refuseValidate", validateShopController.refuseValidate);

router.get("/", validateShopController.index);

export default router;
