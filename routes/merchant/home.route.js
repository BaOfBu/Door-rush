import express from "express";
import homeController from "../../controllers/merchant/home.controller.js";
const router = express.Router();

router.get("/", homeController.index);
router.post("/upload-avatar", homeController.uploadAvatar);
export default router;
