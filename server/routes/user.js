/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../controllers').users;
const userPhonesController = require('../controllers').userphones;
const userAddressController = require('../controllers').useraddress;
const router = express.Router();
const passport = require('../middlewares/passport');
const config = require('../config/index');


//Phone number
router.get('/phoneNumber', [expressJwt({secret: config.jwtSecret}), passport.isUser], userPhonesController.list);
router.post('/phoneNummber', [expressJwt({secret: config.jwtSecret}), passport.isUser], userPhonesController.add);
router.put('/phoneNumber/:phoneId', [expressJwt({secret: config.jwtSecret}), passport.isUser], userPhonesController.setPrimary);
router.delete('/phoneNumber/:phoneId', [expressJwt({secret: config.jwtSecret}), passport.isUser], userPhonesController.delete);

//Address
router.get('/address', [expressJwt({secret: config.jwtSecret}), passport.isUser], userAddressController.list);
router.post('/address', [expressJwt({secret: config.jwtSecret}), passport.isUser], userAddressController.add);
router.delete('/address/:addressId', [expressJwt({secret: config.jwtSecret}), passport.isUser], userAddressController.delete);


//Basic information
router.post('/signUp', usersController.signUp);
router.post('/signIn', usersController.signIn);
router.put('/updateInfo', [expressJwt({secret: config.jwtSecret}), passport.isUser], usersController.updateInfo);
router.get('/profile', [expressJwt({secret: config.jwtSecret}), passport.isUser], usersController.viewProfile);
router.get('/', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], usersController.list);
router.get('/:userId', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], usersController.get);
router.put('/:userId', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], usersController.update); //only update user status

module.exports = router;