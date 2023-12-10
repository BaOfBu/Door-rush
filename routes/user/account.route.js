import express from 'express';
import accountController from '../../controllers/user/account.controller.js';
import auth from '../../middleware/auth.mdw.js';

const router = express.Router();

router.get('/register', accountController.getRegister);

router.post('/register',accountController.postRegister);

router.get('/login', accountController.getLogin);

router.post('/login', accountController.postLogin);

router.post('/logout', auth, accountController.logout);

export default router;