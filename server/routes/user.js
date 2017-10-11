/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../controllers').users;
const userPhonesController = require('../controllers').userphones;
const router = express.Router();
const config = require('../config/index');

//Basic information
router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.put('/updateInfo', expressJwt({ secret: config.jwtSecret }), usersController.updateInfo);
router.get('/profile', expressJwt({ secret: config.jwtSecret }), usersController.viewProfile);
router.get('/', usersController.list);
router.get('/:userId', usersController.get);
router.put('/:userId', usersController.update); //only update user status

//Phone number
router.get('phoneNumber', userPhonesController.list);
router.post('addPhone', userPhonesController.add);
router.put('updatePhone', userPhonesController.update);
router.delete('deletePhone', userPhonesController.delete);

//Address
/*router.get('address', userAddressController.list);
router.post('addAddress', userAddressController.add);
router.put('updateAddress', userAddressController.update);
router.delete('deleteAddress', userAddressController.delete);*/

module.exports = router;