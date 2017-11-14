'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var express = require('express');
var categoriesController = require('../../controllers/web').categories;
var router = express.Router({ mergeParams: true });
var passport = require('../../middlewares/passport');

router.get('/', categoriesController.list);
router.post('/', categoriesController.create);
router.get('/:categoryId', categoriesController.get);
router.post('/:categoryId', categoriesController.update);
router.post('/delete/:categoryId', categoriesController.delete);

module.exports = router;