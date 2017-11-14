'use strict';

/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var discountsController = require('../../controllers/api').discounts;
var router = express.Router();
var config = require('../../config/index');
var passport = require('../../middlewares/passport');

//All employees' routers
router.get('/checkCode', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], discountsController.check);
router.get('/', [expressJwt({ secret: config.jwtSecret }) /*, passport.isAdminAPI*/], discountsController.list);

module.exports = router;