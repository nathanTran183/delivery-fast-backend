/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const usersController = require('../controllers').users;
const router = express.Router();
const config = require('../config/index');

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.patch('/updateInfo', expressJwt({ secret: config.jwtSecret }), usersController.updateInfo);
router.get('/profile', expressJwt({ secret: config.jwtSecret }), usersController.viewProfile);

module.exports = router;