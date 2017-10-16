/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../controllers').users;
const userPhonesController = require('../controllers').userphones;
const userAddressController = require('../controllers').useraddress;
const router = express.Router();
const config = require('../config/index');


//Phone number
router.get('/phoneNumber', expressJwt({ secret: config.jwtSecret }),userPhonesController.list);
router.post('/phoneNummber', expressJwt({ secret: config.jwtSecret }), userPhonesController.add);
router.put('/phoneNumber/:phoneId', expressJwt({ secret: config.jwtSecret }), userPhonesController.setPrimary);
router.delete('/phoneNumber/:phoneId', expressJwt({ secret: config.jwtSecret }), userPhonesController.delete);

//Address
router.get('/address', expressJwt({ secret: config.jwtSecret }), userAddressController.list);
router.post('/address', expressJwt({ secret: config.jwtSecret }), userAddressController.add);
 router.delete('/address/:addressId', expressJwt({ secret: config.jwtSecret }), userAddressController.delete);


//Basic information
router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.put('/updateInfo', expressJwt({ secret: config.jwtSecret }), usersController.updateInfo);
router.get('/profile', expressJwt({ secret: config.jwtSecret }), usersController.viewProfile);
router.get('/', usersController.list);
router.get('/:userId', usersController.get);
router.put('/:userId', usersController.update); //only update user status

module.exports = router;