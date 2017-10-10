'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var express = require('express');
var expressJwt = require('express-jwt');
var usersController = require('../controllers').users;
var router = express.Router();
var config = require('../config');

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.patch('/updateInfo', expressJwt({ secret: config.jwtSecret }), usersController.updateInfo);
router.get('/profile', expressJwt({ secret: config.jwtSecret }), usersController.viewProfile);

module.exports = router;