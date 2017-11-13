/**
 * Created by nathan on 08/11/2017.
 */
const express = require('express');
const ordersController = require('../../controllers/api').orders;
const router = express.Router();
const passport = require('../../middlewares/passport');

router.get('/submitted', passport.notUserWeb, ordersController.getSubmittedList);
router.get('/', ordersController.list);
// router.post('/', ordersController.create);

router.get('/history', passport.isUserAPI, ordersController.history);
router.get('/:orderId', passport.isUserAPI, ordersController.get);
router.put('/:orderId', passport.isUserAPI, ordersController.updateClient);
router.put('/updateStatus/:orderId', passport.isDeliManAPI, ordersController.updateStatus);

module.exports = router;