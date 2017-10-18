/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const employeeRoute = require('./employee');
const storeTypeRoute = require('./storetype');
const storeRoute = require('./store');
const express = require('express');
const expressJwt = require('express-jwt');
const passport = require('../middlewares/passport');
const config = require('../config/index');
const router = express.Router();

router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
}));
router.use('/users', usersRoute);
router.use('/employees', employeeRoute);
router.use('/stores', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeRoute);
router.use('/storeTypes', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypeRoute);
// router.use('/order');

module.exports = router;