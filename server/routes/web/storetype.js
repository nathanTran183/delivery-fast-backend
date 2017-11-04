/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storeTypesController = require('../../controllers/web').storetypes;
const router = express.Router();

router.get('/', storeTypesController.list);
router.post('/', storeTypesController.create);
// router.get('/:storeTypeId', storeTypesController.get);
router.post('/:storeTypeId', storeTypesController.update);
router.post('/delete/:storeTypeId', storeTypesController.delete);


module.exports = router;