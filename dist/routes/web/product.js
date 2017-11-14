'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var express = require('express');
var productsController = require('../../controllers/web').products;
var router = express.Router({ mergeParams: true });
var passport = require('../../middlewares/passport');

// router.get('/', productsController.list);
router.post('/', productsController.create);
router.get('/:productId', productsController.get);
router.post('/:productId', productsController.update);
router.post('/delete/:productId', productsController.delete);

module.exports = router;