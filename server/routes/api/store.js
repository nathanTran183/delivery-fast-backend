/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storesController = require('../../controllers/api').stores;
const router = express.Router();
const config = require('../../config/index');
const expressJwt = require('express-jwt');


router.get('/', storesController.list);
router.get('/storeType',storesController.storeTypeList);
router.get('/:storeId', storesController.get);

module.exports = router;