import express from "express";
import homeController from "../../controllers/user/home.controller.js";
import Account from "../../models/accountModel.js";

const router = express.Router();

router.get("/", homeController.index);

export default router;
