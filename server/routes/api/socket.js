/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const socketController = require('../../controllers/api').socket;
const router = express.Router();

router.get('/test', socketController.test);


module.exports = router;