'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var usersController = require('../controllers').users;
var userPhonesController = require('../controllers').userphones;
var userAddressController = require('../controllers').useraddress;
var router = express.Router();
var passport = require('../middlewares/passport');
var config = require('../config/index');

//Phone number
router.get('/phoneNumber', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userPhonesController.list);
router.post('/phoneNummber', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userPhonesController.add);
router.put('/phoneNumber/:phoneId', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userPhonesController.setPrimary);
router.delete('/phoneNumber/:phoneId', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userPhonesController.delete);
router.get('/test', usersController.test);
//Address
router.get('/address', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userAddressController.list);
router.post('/address', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userAddressController.add);
router.delete('/address/:addressId', [expressJwt({ secret: config.jwtSecret }), passport.isUser], userAddressController.delete);

//Basic information
router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.put('/updateInfo', [expressJwt({ secret: config.jwtSecret }), passport.isUser], usersController.updateInfo);
router.get('/profile', [expressJwt({ secret: config.jwtSecret }), passport.isUser], usersController.viewProfile);
router.get('/', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], usersController.list);
router.get('/:userId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], usersController.get);
router.put('/:userId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], usersController.update); //only update user status

module.exports = router;