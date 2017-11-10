/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const employeeRoute = require('./employee');
const storeTypeRoute = require('./storetype');
const storeRoute = require('./store');
const categoryRoute = require('./category');
const addonRoute = require('./addon');
const productRoute = require('./product');
const productaddonRoute = require('./productaddon');
const employeesController = require('../../controllers/web').employees;

const express = require('express');
const passport = require('../../middlewares/passport');
const router = express.Router();

router.get('/', (req, res) => res.send(res.sendFile('/uploads/image1.jpg')));
router.use('/users', passport.isAdminWeb, usersRoute);
router.use('/employees', passport.isAdminWeb, employeeRoute);
router.use('/stores', passport.isAdminWeb, storeRoute);
router.use('/storeTypes', passport.isAdminWeb, storeTypeRoute);
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