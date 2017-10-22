/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const employeeRoute = require('./employee');
const storeTypeRoute = require('./storetype');
const storeRoute = require('./store');
const employeesController = require('../../controllers/web').employees;

const express = require('express');
const expressJwt = require('express-jwt');
const passport = require('../../middlewares/passport');
const config = require('../../config/index');
const router = express.Router();

router.get('/', (req, res) => res.send({
    message: 'Welcome to the User Web!',
}));
router.use('/users', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], storeRoute);
router.use('/storeTypes', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], storeTypeRoute);
// router.use('/order');

//DeliMans' routers
router.get('/signIn', employeesController.signIn);
router.post('/postSignIn', employeesController.postSignIn);
router.get('/profile', passport.notUserWeb, employeesController.profile);
router.post('/updateInfo', passport.notUserWeb, employeesController.updateInfo);

module.exports = router;