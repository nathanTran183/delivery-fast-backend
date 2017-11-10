/**
 * Created by nathan on 06/11/2017.
 */
const express = require('express');
const productsController = require('../../controllers/web').products;
const router = express.Router({mergeParams: true});
const passport = require('../../middlewares/passport');

// router.get('/', productsController.list);
router.post('/', productsController.create);
router.get('/:productId', productsController.get);
router.post('/:productId', productsController.update);
router.post('/delete/:productId', productsController.delete);

module.exports = router;