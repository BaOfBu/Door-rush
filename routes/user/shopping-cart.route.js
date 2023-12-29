import express from "express"
import shoppingCartController from "../../controllers/user/shopping-cart.controller.js"
const router = express.Router()

router.get("/:userID", shoppingCartController.getCartList)
router.get("/:userID/:orderID", shoppingCartController.getOrder)

export default router