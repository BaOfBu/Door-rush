import express from "express";
import manageUserController from "../../controllers/admin/manage-user.controller.js";
const router = express.Router();
router.get("/search", manageUserController.searchUsers);

// /admin/manage-user/ban-user?userId={{this.id}}
router.post("/ban-user", manageUserController.banUser);

router.get("/", manageUserController.index);
export default router;
