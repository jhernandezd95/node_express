const express = require('express');
const itemController = require('../controllers/item-controller');
const registerRequest = require('../middlewares/register-request');

const router = express.Router();

router.get('/item', registerRequest(), itemController.getAll);

module.exports = router;