/**
 * Created by nathan on 05/10/2017.
 */
const usersRoute = require('./user');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the User API!',
}));
router.use('/users', usersRoute);

module.exports = router;