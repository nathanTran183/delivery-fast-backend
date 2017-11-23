'use strict';

/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var employeesController = require('../../controllers/api').employees;
var router = express.Router();
var config = require('../../config/index');
var passport = require('../../middlewares/passport');

//DeliMans' routers
router.post('/signIn', employeesController.signIn);

//All employees' routers
router.get('/profile', [expressJwt({ secret: config.jwtSecret }), passport.isDeliManAPI], employeesController.viewProfile);
router.put('/updateInfo', [expressJwt({ secret: config.jwtSecret }), passport.isDeliManAPI], employeesController.updateInfo);
router.put('/updateStatus', [expressJwt({ secret: config.jwtSecret }), passport.isDeliManAPI], employeesController.updateStatus);

module.exports = router;