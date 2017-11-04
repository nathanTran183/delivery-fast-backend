/**
 * Created by nathan on 17/10/2017.
 */
const express = require('express');
const storesController = require('../../controllers/web').stores;
const router = express.Router();
const multer = require('multer');
// const upload = multer({ dest: 'server/publics/uploads' }); // multer configuration

router.get('/', storesController.list);
router.post('/', storesController.create);
router.get('/create', storesController.add)
router.post('/:storeId', storesController.update);
router.get('/:storeId', storesController.get);

module.exports = router;