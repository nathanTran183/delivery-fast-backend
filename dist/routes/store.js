'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var storesController = require('../controllers').stores;
var router = express.Router();
var config = require('../config/index');
var passport = require('../middlewares/passport');

router.get('/', storesController.list);
router.post('/', storesController.create);
router.put('/:storeId', storesController.update);
router.get('/:storeId', storesController.get);

module.exports = router;