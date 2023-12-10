import express from "express";
import profileController from "../../controllers/user/profile.controller.js";
const router = express.Router();

router.get("/", profileController.index);

export default router;
