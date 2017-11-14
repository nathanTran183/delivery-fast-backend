'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var usersRoute = require('./user');
var employeeRoute = require('./employee');
var storeRoute = require('./store');
var orderRoute = require('./order');
var discountRoute = require('./discount');
var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var passport = require('../../middlewares/passport');
var config = require('../../config/index');

router.get('/', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to the User API!'
  });
});
router.use('/users', usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', storeRoute);
router.use('/discounts', discountRoute);
router.use('/orders', [expressJwt({ secret: config.jwtSecret })], orderRoute);

module.exports = router;