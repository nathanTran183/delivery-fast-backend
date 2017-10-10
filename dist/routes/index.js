'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var usersRoute = require('./user');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  return res.status(200).send({
    message: 'Welcome to the User API!'
  });
});
router.use('/users', usersRoute);

module.exports = router;