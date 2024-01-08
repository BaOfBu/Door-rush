import express from "express"
import shoppingCartController from "../../controllers/user/shopping-cart.controller.js"
const router = express.Router()

router.get("/", shoppingCartController.displayOrder)
router.get("/food-voucher", shoppingCartController.displayFoodVoucher)
router.get("/ship-voucher", shoppingCartController.displayShipVoucher)
router.get("/add-voucher", shoppingCartController.addVoucher)
router.get("/remove-voucher", shoppingCartController.removeVoucher)
router.get("/address", shoppingCartController.displayAddresss)
router.get("/add-address", shoppingCartController.addAddress)
router.get("/submit-order", shoppingCartController.submitOrder)
router.get("/delete-item", shoppingCartController.deleteItem)
router.get("/delete-all-item", shoppingCartController.deleteAllItem)

export default router