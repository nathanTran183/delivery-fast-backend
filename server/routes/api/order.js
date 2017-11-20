/**
 * Created by nathan on 08/11/2017.
 */
const express = require('express');
const ordersController = require('../../controllers/api').orders;
const router = express.Router();
const passport = require('../../middlewares/passport');
const expressJwt = require('express-jwt');
const config = require('../../config/index');

router.get('/', ordersController.list);
router.get('/history', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], ordersController.history);
router.get('/deliMan', [expressJwt({secret: config.jwtSecret}), passport.isDeliManAPI], ordersController.getOrderList);
router.put('/updateStatusEmp/:orderId', [expressJwt({secret: config.jwtSecret}), passport.isDeliManAPI], ordersController.updateStatus);
router.put('/updateStatusUser/:orderId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], ordersController.updateStatus);
router.get('/:orderId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], ordersController.get);
router.put('/:orderId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], ordersController.updateClient);


module.exports = router;