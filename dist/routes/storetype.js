'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var storeTypesController = require('../controllers').storetypes;
var router = express.Router();
var config = require('../config/index');
var passport = require('../middlewares/passport');

router.get('/', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypesController.list);
router.post('/', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypesController.create);
router.put('/:storeTypeId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypesController.update);
router.delete('/:storeTypeId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypesController.delete);
router.get('/:storeTypeId', [expressJwt({ secret: config.jwtSecret }), passport.isAdmin], storeTypesController.get);

module.exports = router;