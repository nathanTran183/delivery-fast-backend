/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storesController = require('../../controllers/api').stores;
const router = express.Router();
const config = require('../../config/index');
const expressJwt = require('express-jwt');
const passport = require('../../middlewares/passport');

//test
router.get('/storeType', storesController.testing);

router.get('/', storesController.list);
router.get('/search', storesController.search);
router.get('/token/:storeId', [expressJwt({secret: config.jwtSecret}), passport.isUserAPI], storesController.get);
router.get('/:storeId', storesController.get);


module.exports = router;