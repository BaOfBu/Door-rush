import express from "express";
import manageUserController from "../../controllers/admin/manage-user.controller.js";
const router = express.Router();
router.get("/", manageUserController.index);
export default router;
