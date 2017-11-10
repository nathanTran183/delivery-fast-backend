/**
 * Created by nathan on 06/11/2017.
 */
const express = require('express');
const categoriesController = require('../../controllers/web').categories;
const router = express.Router({mergeParams: true});
const passport = require('../../middlewares/passport');

router.get('/', categoriesController.list);
router.post('/', categoriesController.create);
router.get('/:categoryId', categoriesController.get);
router.post('/:categoryId', categoriesController.update);
router.post('/delete/:categoryId', categoriesController.delete);

module.exports = router;