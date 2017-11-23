'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var express = require('express');
var socketController = require('../../controllers/api').socket;
var router = express.Router();

router.get('/test', socketController.test);

module.exports = router;