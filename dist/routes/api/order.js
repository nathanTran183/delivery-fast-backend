'use strict';

/**
 * Created by nathan on 08/11/2017.
 */
var express = require('express');
var ordersController = require('../../controllers/api').orders;
var router = express.Router();
var passport = require('../../middlewares/passport');
var expressJwt = require('express-jwt');
var config = require('../../config/index');

router.get('/', ordersController.list);
router.get('/history', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], ordersController.history);
router.get('/deliMan', [expressJwt({ secret: config.jwtSecret }), passport.isDeliManAPI], ordersController.getOrderList);
router.put('/updateStatusEmp/:orderId', [expressJwt({ secret: config.jwtSecret }), passport.isDeliManAPI], ordersController.updateStatus);
router.put('/updateStatusUser/:orderId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], ordersController.updateStatus);
router.get('/:orderId', [expressJwt({ secret: config.jwtSecret }), passport.isAppAPI], ordersController.get);
router.put('/:orderId', [expressJwt({ secret: config.jwtSecret }), passport.isUserAPI], ordersController.updateClient);

module.exports = router;