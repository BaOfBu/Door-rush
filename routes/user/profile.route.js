import express from "express";
import profileController from "../../controllers/user/profile.controller.js";
import auth from "../../middleware/auth.mdw.js";

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", auth.authUser, profileController.viewProfile);

router.post("/", profileController.updateUserInformation);

router.post("/upload-avatar", profileController.uploadAvatar);

router.get("/is-available", auth.authUser, profileController.isAvailable);

export default router;