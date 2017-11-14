'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var express = require('express');
var storesController = require('../../controllers/api').stores;
var router = express.Router();
var config = require('../../config/index');
var expressJwt = require('express-jwt');
var passport = require('../../middlewares/passport');

//test
router.get('/storeType', storesController.testing);

router.get('/', storesController.list);
router.get('/search', storesController.search);
router.get('/token/:storeId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], storesController.get);
router.get('/:storeId', storesController.get);

module.exports = router;