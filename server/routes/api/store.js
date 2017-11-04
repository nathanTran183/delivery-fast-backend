/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storesController = require('../../controllers/api').stores;
const router = express.Router();
const expressJwt = require('express-jwt');
const passport = require('../../middlewares/passport');
const config = require('../../config/index');

router.get('/', storesController.list);
router.post('/', storesController.create);
router.get('/:storeId', storesController.get);

module.exports = router;