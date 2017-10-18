'use strict';

/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var employeesController = require('../controllers').employees;
var router = express.Router();
var config = require('../config/index');
var passport = require('../middlewares/passport');

//DeliMans' routers
router.post('/signIn', employeesController.signIn);

//All employees' routers
router.get('/profile', [expressJwt({ secret: config.jwtSecret }), passport.notUser], employeesController.viewProfile);
router.post('/updateInfo', [expressJwt({ secret: config.jwtSecret }), passport.notUser], employeesController.updateInfo);

router.get('/', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], employeesController.list);
router.post('/', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], employeesController.create);
router.get('/:employeeId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], employeesController.get);
router.put('/:employeeId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], employeesController.update);

module.exports = router;