const express = require('express');
const passport = require('passport');
const userController = require('../controllers/user-controller');
const roleController = require('../controllers/role-controller');
const logController = require('../controllers/log-controller');
const registerRequest = require('../middlewares/register-request');
const checkRole = require('../middlewares/check-role');

const router = express.Router();

router.get('/users', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.getAll);

router.post('/users', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.create);

router.patch('/users/:id/change-role', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.changeRole);

router.patch('/users/:id/change-status', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.changeStatus);
    
router.patch('/users/:id', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.update);

router.delete('/users/:id', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            userController.remove);

router.get('/role', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            roleController.getAll);

router.get('/log', 
            passport.authenticate('jwt', { session: false }), registerRequest(), checkRole(['Admin']), 
            logController.getAll);

module.exports = router;