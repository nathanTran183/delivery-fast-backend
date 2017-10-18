'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var usersRoute = require('./user');
var employeeRoute = require('./employee');
var storeTypeRoute = require('./storetype');
var storeRoute = require('./store');
var express = require('express');
var expressJwt = require('express-jwt');
var passport = require('../middlewares/passport');
var config = require('../config/index');
var router = express.Router();

router.get('/', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to the User API!'
  });
});
router.use('/users', usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeRoute);
router.use('/storeTypes', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypeRoute);
// router.use('/order');

module.exports = router;