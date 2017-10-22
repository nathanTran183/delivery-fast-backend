/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../../controllers/api').users;
const userPhonesController = require('../../controllers/api').userphones;
const userAddressController = require('../../controllers/api').useraddress;
const router = express.Router();
const passport = require('../../middlewares/passport');
const config = require('../../config/index');

//Basic information
router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.put('/updateInfo', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], usersController.updateInfo);
router.get('/profile', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], usersController.viewProfile);

//Phone number
router.get('/phoneNumber', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userPhonesController.list);
router.post('/phoneNummber', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userPhonesController.add);
router.put('/phoneNumber/:phoneId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userPhonesController.setPrimary);
router.delete('/phoneNumber/:phoneId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userPhonesController.delete);

//Address
router.get('/address', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userAddressController.list);
router.post('/address', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userAddressController.add);
router.delete('/address/:addressId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], userAddressController.delete);




module.exports = router;