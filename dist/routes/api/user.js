'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var usersController = require('../../controllers/api').users;
var userPhonesController = require('../../controllers/api').userphones;
var userAddressController = require('../../controllers/api').useraddress;
var router = express.Router();
var passport = require('../../middlewares/passport');
var config = require('../../config/index');

//Basic information
router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.put('/updateInfo', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], usersController.updateInfo);
router.get('/profile', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], usersController.viewProfile);

//Phone number
router.get('/phoneNumber', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userPhonesController.list);
router.post('/phoneNumber', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userPhonesController.add);
router.put('/phoneNumber/:phoneId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userPhonesController.setPrimary);
router.delete('/phoneNumber/:phoneId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userPhonesController.delete);

//Address
router.get('/address', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userAddressController.list);
router.post('/address', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userAddressController.add);
router.put('/address/:addressId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userAddressController.update);
router.delete('/address/:addressId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], userAddressController.delete);

module.exports = router;