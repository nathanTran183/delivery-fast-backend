/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const storesController = require('../controllers').stores;
const router = express.Router();
const config = require('../config/index');
const passport = require('../middlewares/passport');

router.get('/', storesController.list);
router.post('/', storesController.create);
router.put('/:storeId', storesController.update);
router.get('/:storeId', storesController.get);

module.exports = router;