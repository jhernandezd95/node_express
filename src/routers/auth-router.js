const express = require('express');
const authController = require('../controllers/auth-controller');
const registerRequest = require('../middlewares/register-request');

const router = express.Router();

router.post('/signup', registerRequest(), authController.signup);

router.post('/verify-code', registerRequest(), authController.verifyCode);

router.post('/login', registerRequest(), authController.login);

module.exports = router;