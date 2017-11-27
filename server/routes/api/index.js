/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const employeeRoute = require('./employee');
const storeRoute = require('./store');
const orderRoute = require('./order');
const socketRoute = require('./socket');
const discountRoute = require('./discount');
const notificationRoute = require('./notification');
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const passport = require('../../middlewares/passport');
const config = require('../../config/index');
var schedule = require('node-schedule');

router.get('/', (req, res) => {
    var j = schedule.scheduleJob('*/5 * * * * *', function(){
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