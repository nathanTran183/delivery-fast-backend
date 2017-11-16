/**
 * Created by nathan on 13/11/2017.
 */
const express = require('express');
const ordersController = require('../../controllers/web').orders;
const router = express.Router();

router.get('/', ordersController.list);
router.get('/submitted', ordersController.getSubmittedList);
router.get('/submitted/:orderId', ordersController.getSubmitted);
router.get('/processing/:orderId', ordersController.getProcessing);
router.post('/:orderId', ordersController.update);
router.get('/:orderId', ordersController.get);
router.get('/history', ordersController.history);

module.exports = router;