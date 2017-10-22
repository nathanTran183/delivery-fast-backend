/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../../controllers/web').users;
const userPhonesController = require('../../controllers/web').userphones;
const userAddressController = require('../../controllers/web').useraddress;
const router = express.Router();
const passport = require('../../middlewares/passport');
const config = require('../../config/index');

router.get('/', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], usersController.list);
router.get('/:userId', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], usersController.get);
router.put('/:userId', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], usersController.update); //only update user status
module.exports = router;