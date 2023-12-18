import express from "express";
import profileController from "../../controllers/user/profile.controller.js";

const router = express.Router();

router.get("/:userID", profileController.viewProfile);

router.post("/:userID", profileController.updateUserInformation);

export default router;