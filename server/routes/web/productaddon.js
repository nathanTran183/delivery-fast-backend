/**
 * Created by nathan on 06/11/2017.
 */
const express = require('express');
const productAddonsController = require('../../controllers/web').productaddons;
const router = express.Router({mergeParams: true});
const passport = require('../../middlewares/passport');

router.get('/', productAddonsController.list);
router.post('/', productAddonsController.create);
router.get('/:productAddonId', productAddonsController.get);
router.post('/:productAddonId', productAddonsController.update);
router.post('/delete/:productAddonId', productAddonsController.delete);

module.exports = router;