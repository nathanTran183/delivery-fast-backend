'use strict';

/**
 * Created by nathan on 13/11/2017.
 */
var express = require('express');
var ordersController = require('../../controllers/web').orders;
var router = express.Router();
var passport = require('../../middlewares/passport');

router.get('/', ordersController.list);
router.get('/submitted', ordersController.getSubmittedList);
router.get('/submittedJSON', ordersController.getSubmittedListJSON);

router.get('/processing/:orderId', ordersController.getSubmitted);
router.get('/assigned/:orderId', ordersController.getProcessing);
router.post('/:orderId', ordersController.update);
router.get('/:orderId', ordersController.get);
router.get('/history', ordersController.history);

module.exports = router;