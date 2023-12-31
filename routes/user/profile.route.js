import express from "express";
import profileController from "../../controllers/user/profile.controller.js";
import auth from "../../middleware/auth.mdw.js";

const router = express.Router();

router.get("/:userID",auth.authUser, profileController.viewProfile);

router.post("/:userID", profileController.updateUserInformation);

router.get("/:userID/is-available", profileController.isAvailable);

export default router;