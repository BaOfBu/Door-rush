import express from 'express';
import accountController from '../../controllers/user/account.controller.js';
import auth from '../../middleware/auth.mdw.js';

const router = express.Router();

router.get('/register', accountController.getRegister);

router.post('/register',accountController.postRegister);

router.get('/login', accountController.getLogin);

router.post('/login', accountController.postLogin);

router.post('/logout', accountController.logout);

// eg: /account/is-available?username=abc
router.get('/is-available-user',accountController.is_available_user);

router.get('/is-available-email',accountController.is_available_email);

router.post('/register/verification',accountController.post_verification);

router.get('/register/verification',accountController.get_verification);

export default router;