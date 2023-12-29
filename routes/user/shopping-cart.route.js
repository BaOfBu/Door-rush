import express from "express"
import shoppingCartController from "../../controllers/user/shopping-cart.controller.js"
const router = express.Router()

router.get("/", shoppingCartController.getOrder)

export default router