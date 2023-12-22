import express from 'express';
import accountController from '../../controllers/user/account.controller.js';
import auth from '../../middleware/auth.mdw.js';

const router = express.Router();

router.get('/register', accountController.getRegister);

router.post('/register',accountController.postRegister);

router.get('/login', accountController.getLogin);

router.post('/login', accountController.postLogin);

router.post('/logout', auth, accountController.logout);

// eg: /account/is-available?username=abc
router.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    if (!user) {
        return res.json(true);
    }
    res.json(false);
});

router.get("/forgotpassword", accountController.getForgotPassword);
router.post("/forgotpassword", accountController.postForgotPassword);

export default router;