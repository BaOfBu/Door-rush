import express from "express";
import homeController from "../../controllers/user/home.controller.js";
import Account from "../../models/accountModel.js";

const router = express.Router();

router.get("/", homeController.index);

router.get("/test", async function (req, res, next) {
    const account = await Account.find();
    console.log(account);
});

export default router;
