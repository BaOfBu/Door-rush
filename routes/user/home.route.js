import express from "express";
import homeController from "../../controllers/user/home.controller.js";
const router = express.Router();

router.get("/", homeController.index);

export default router;