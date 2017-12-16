'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var express = require('express');
var storesController = require('../../controllers/web').stores;
var router = express.Router();
var multer = require('multer');
var passport = require('../../middlewares/passport');

router.get('/', storesController.list);
router.post('/', storesController.create);
router.get('/create', storesController.add);
router.post('/updateStatus/:storeId', storesController.updateStatus);
router.post('/:storeId', storesController.update);
router.get('/:storeId', storesController.get);

module.exports = router;