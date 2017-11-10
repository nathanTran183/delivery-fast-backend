/**
 * Created by nathan on 08/11/2017.
 */
const express = require('express');
const ordersController = require('../../controllers/api').orders;
const router = express.Router();


router.get('/submitted', ordersController.getSubmittedList);
router.post('/', ordersController.create);
router.get('/',ordersController.list);
router.get('/history', ordersController.history);
router.get('/:orderId', ordersController.get);
router.put('/:orderId', ordersController.update);

module.exports = router;