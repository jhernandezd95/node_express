const express = require('express');
const passport = require('passport');
const itemController = require('../controllers/item-controller');
const registerRequest = require('../middlewares/register-request');

const router = express.Router();

router.post('/item', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin', 'Business']), 
            itemController.create);

router.get('/item', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin', 'Business']), 
            itemController.getFromOwner);

module.exports = router;