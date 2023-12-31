import express from "express"
import shoppingCartController from "../../controllers/user/shopping-cart.controller.js"
const router = express.Router()

router.get("/", shoppingCartController.displayOrder)
router.get("/food-voucher", shoppingCartController.displayFoodVoucher)
router.get("/ship-voucher", shoppingCartController.displayShipVoucher)
router.get("/add-voucher", shoppingCartController.addVoucher)
router.get("/order-address", shoppingCartController.displayOrder)

export default router