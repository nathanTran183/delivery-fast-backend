/**
 * Created by nathan on 05/10/2017.
 */
const express = require('express');
const usersController = require('../../controllers/web').users;
const router = express.Router();

router.get('/', usersController.list);
router.get('/blackList', usersController.blackList);
router.get('/:userId', usersController.get);
router.post('/:userId', usersController.update); //only update user status
module.exports = router;