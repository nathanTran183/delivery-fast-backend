'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var express = require('express');
var storeTypesController = require('../../controllers/web').storetypes;
var router = express.Router();

router.get('/', storeTypesController.list);
router.post('/', storeTypesController.create);
// router.get('/:storeTypeId', storeTypesController.get);
router.post('/:storeTypeId', storeTypesController.update);
router.post('/delete/:storeTypeId', storeTypesController.delete);

module.exports = router;