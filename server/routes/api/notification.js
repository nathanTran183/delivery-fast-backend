/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const notificationsController = require('../../controllers/api').notifications;
const router = express.Router();
const config = require('../../config/index');
const passport = require('../../middlewares/passport');

//All employees' routers
router.get('/', [expressJwt({secret: config.jwtSecret}), passport.isAppAPI], notificationsController.list);

module.exports = router;