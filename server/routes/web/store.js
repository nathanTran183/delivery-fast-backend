/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storesController = require('../../controllers/web').stores;
const router = express.Router();

router.get('/', storesController.list);
router.post('/', storesController.create);
router.put('/:storeId', storesController.update);
router.get('/:storeId', storesController.get);

module.exports = router;