'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var usersRoute = require('./user');
var employeeRoute = require('./employee');
var storeTypeRoute = require('./storetype');
var storeRoute = require('./store');
var categoryRoute = require('./category');
var addonRoute = require('./addon');
var productRoute = require('./product');
var productaddonRoute = require('./productaddon');
var discountRoute = require('./discount');
var orderRoute = require('./order');
var employeesController = require('../../controllers/web').employees;

var express = require('express');
var passport = require('../../middlewares/passport');
var router = express.Router();

router.get('/', function (req, res) {
  return res.send(res.sendFile('/uploads/image1.jpg'));
});
router.use('/users', passport.isAdminWeb, usersRoute);
router.use('/employees', passport.isAdminWeb, employeeRoute);
router.use('/stores', passport.isAdminWeb, storeRoute);
router.use('/storeTypes', passport.isAdminWeb, storeTypeRoute);
router.use('/discounts', passport.isAdminWeb, discountRoute);
router.use('/orders', passport.notUserWeb, orderRoute);
router.use('/stores/:storeId/categories', passport.isAdminWeb, categoryRoute);
router.use('/stores/:storeId/categories/:categoryId/addons', passport.isAdminWeb, addonRoute);
router.use('/stores/:storeId/categories/:categoryId/products', passport.isAdminWeb, productRoute);
router.use('/stores/:storeId/categories/:categoryId/productAddons', passport.isAdminWeb, productaddonRoute);

// router.use('/order');

//DeliMans' routers
router.get('/signIn', employeesController.signIn);
router.post('/postSignIn', employeesController.postSignIn);
router.get('/profile', passport.notUserWeb, employeesController.profile);
router.get('/logout', employeesController.logout);
router.post('/changePassword', passport.notUserWeb, employeesController.changePassword);
router.post('/updateInfo', passport.notUserWeb, employeesController.updateInfo);

module.exports = router;