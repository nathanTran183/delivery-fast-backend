/**
 * Created by nathan on 06/11/2017.
 */
const express = require('express');
const addonsController = require('../../controllers/web').addons;
const router = express.Router({mergeParams: true});
const passport = require('../../middlewares/passport');

// router.get('/', addonsController.list);
router.post('/', addonsController.create);
router.get('/:addonId', addonsController.get);
router.post('/:addonId', addonsController.update);
router.post('/delete/:addonId', addonsController.delete);

module.exports = router;