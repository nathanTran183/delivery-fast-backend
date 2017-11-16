/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const employeeRoute = require('./employee');
const storeRoute = require('./store');
const orderRoute = require('./order');
const discountRoute = require('./discount');
const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const passport = require('../../middlewares/passport');
const config = require('../../config/index');

router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
}));
router.use('/users', usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', storeRoute);
router.use('/discounts', discountRoute);
router.use('/orders', orderRoute);

module.exports = router;