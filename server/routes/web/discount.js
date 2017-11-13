/**
 * Created by nathan on 12/11/2017.
 */
const express = require('express');
const discountsController = require('../../controllers/web').discounts;
const router = express.Router();

router.get('/', discountsController.list);
router.post('/', discountsController.create);
router.post('/:discountId', discountsController.delete);
router.get('/generateCode', discountsController.generateCode);


module.exports = router;