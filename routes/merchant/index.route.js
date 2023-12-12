import express from "express";
const router = express.Router();

function setDefaultLayoutAndPartials(req, res, next) {
    res.locals.layout = "merchant/layouts/main";
    next();
}

router.use(setDefaultLayoutAndPartials);

export default router;
