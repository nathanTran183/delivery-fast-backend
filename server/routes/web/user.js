/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const usersController = require('../../controllers/web').users;
const userPhonesController = require('../../controllers/web').userphones;
const userAddressController = require('../../controllers/web').useraddress;
const router = express.Router();
const passport = require('../../middlewares/passport');

router.get('/', passport.isAdminWeb, usersController.list);
router.get('/:userId', passport.isAdminWeb, usersController.get);
router.post('/:userId', passport.isAdminWeb, usersController.update); //only update user status
module.exports = router;