const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user-controller');
const registerRequest = require('../middlewares/register-request');

const router = express.Router();

router.patch('/', 
            passport.authenticate('jwt', { session: false }), registerRequest(),
            userController.update);

router.delete('/',
            passport.authenticate('jwt', { session: false }), registerRequest(),
            userController.remove);

module.exports = router;