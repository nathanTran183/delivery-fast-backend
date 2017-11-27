'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var usersRoute = require('./user');
var employeeRoute = require('./employee');
var storeRoute = require('./store');
var orderRoute = require('./order');
var socketRoute = require('./socket');
var discountRoute = require('./discount');
var notificationRoute = require('./notification');
var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');
var passport = require('../../middlewares/passport');
var config = require('../../config/index');
var schedule = require('node-schedule');

router.get('/', function (req, res) {
    var j = schedule.scheduleJob('*/5 * * * * *', function () {
        console.log('The answer to life, the universe, and everything!');
    });
});

router.use('/users', usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', storeRoute);
router.use('/discounts', discountRoute);
router.use('/orders', orderRoute);
router.use('/socket', socketRoute);
router.use('/notifications', notificationRoute);

module.exports = router;