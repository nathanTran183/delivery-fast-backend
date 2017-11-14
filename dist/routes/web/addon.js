'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var express = require('express');
var addonsController = require('../../controllers/web').addons;
var router = express.Router({ mergeParams: true });
var passport = require('../../middlewares/passport');

// router.get('/', addonsController.list);
router.post('/', addonsController.create);
router.get('/:addonId', addonsController.get);
router.post('/:addonId', addonsController.update);
router.post('/delete/:addonId', addonsController.delete);

module.exports = router;