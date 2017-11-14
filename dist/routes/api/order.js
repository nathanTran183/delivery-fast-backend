'use strict';

/**
 * Created by nathan on 08/11/2017.
 */
var express = require('express');
var ordersController = require('../../controllers/api').orders;
var router = express.Router();
var passport = require('../../middlewares/passport');

router.get('/submitted', passport.notUserWeb, ordersController.getSubmittedList);
router.get('/', ordersController.list);
// router.post('/', ordersController.create);

router.get('/history', passport.isUserAPI, ordersController.history);
router.get('/:orderId', passport.isUserAPI, ordersController.get);
router.put('/:orderId', passport.isUserAPI, ordersController.updateClient);
router.put('/updateStatus/:orderId', passport.isDeliManAPI, ordersController.updateStatus);

module.exports = router;