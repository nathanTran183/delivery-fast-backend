/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const storeTypesController = require('../controllers').storetypes;
const router = express.Router();
const config = require('../config/index');
const passport = require('../middlewares/passport');

router.get('/', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypesController.list);
router.post('/', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypesController.create);
router.put('/:storeTypeId', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypesController.update);
router.delete('/:storeTypeId', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypesController.delete);
router.get('/:storeTypeId', [expressJwt({secret: config.jwtSecret}), passport.isAdmin], storeTypesController.get);


module.exports = router;