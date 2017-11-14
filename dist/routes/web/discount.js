'use strict';

/**
 * Created by nathan on 12/11/2017.
 */
var express = require('express');
var discountsController = require('../../controllers/web').discounts;
var router = express.Router();

router.get('/', discountsController.list);
router.post('/', discountsController.create);
router.post('/:discountId', discountsController.delete);
router.get('/generateCode', discountsController.generateCode);

module.exports = router;