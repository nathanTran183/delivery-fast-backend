'use strict';

/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var notificationsController = require('../../controllers/api').notifications;
var router = express.Router();
var config = require('../../config/index');
var passport = require('../../middlewares/passport');

//All employees' routers
router.get('/', [expressJwt({ secret: config.jwtSecret }), passport.isAppAPI], notificationsController.list);

module.exports = router;