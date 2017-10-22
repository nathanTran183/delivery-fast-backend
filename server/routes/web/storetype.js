/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storeTypesController = require('../../controllers/web').storetypes;
const router = express.Router();

router.get('/', storeTypesController.list);
router.post('/', storeTypesController.create);
router.put('/:storeTypeId', storeTypesController.update);
router.delete('/:storeTypeId', storeTypesController.delete);
router.get('/:storeTypeId', storeTypesController.get);


module.exports = router;