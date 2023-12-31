import express from "express"
import shoppingCartController from "../../controllers/user/shopping-cart.controller.js"
const router = express.Router()

router.get("/", shoppingCartController.displayOrder)
router.get("/food-voucher", shoppingCartController.displayFoodVoucher)
router.get("/ship-voucher", shoppingCartController.displayShipVoucher)
router.get("/add-voucher", shoppingCartController.addVoucher)
router.get("/address", shoppingCartController.displayAddresss)
router.get("/add-address", shoppingCartController.addAddress)
router.get("/submit-order", shoppingCartController.submitOrder)

export default router