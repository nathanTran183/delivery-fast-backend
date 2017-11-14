'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var express = require('express');
var productAddonsController = require('../../controllers/web').productaddons;
var router = express.Router({ mergeParams: true });
var passport = require('../../middlewares/passport');

router.get('/', productAddonsController.list);
router.post('/', productAddonsController.create);
router.get('/:productAddonId', productAddonsController.get);
router.post('/:productAddonId', productAddonsController.update);
router.post('/delete/:productAddonId', productAddonsController.delete);

module.exports = router;