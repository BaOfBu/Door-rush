import express from "express";
import contactController from "../../controllers/user/contact.controller.js";
const router = express.Router();
router.get("/", contactController.index);
export default router;
