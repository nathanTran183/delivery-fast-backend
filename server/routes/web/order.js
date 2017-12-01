/**
 * Created by nathan on 13/11/2017.
 */
const express = require('express');
const ordersController = require('../../controllers/web').orders;
const router = express.Router();
const passport = require('../../middlewares/passport');

router.get('/', ordersController.list);
router.get('/submitted', ordersController.getSubmittedList);
router.get('/submittedJSON', ordersController.getSubmittedListJSON);
router.get('/processing', ordersController.getProcessingList);
router.get('/processingJSON', ordersController.getProcessingListJSON);
router.get('/processing/:orderId', ordersController.getSubmitted);
router.get('/assigned/:orderId', ordersController.getProcessing);
router.get('/historyJSON', ordersController.getHistoryJSON);
router.get('/history', ordersController.history);
router.get('/statistics', ordersController.statistics);
router.get('/statisticsJSON', ordersController.getStatisticsJSON);
router.post('/:orderId', ordersController.update);
router.get('/:orderId', ordersController.get);


module.exports = router;