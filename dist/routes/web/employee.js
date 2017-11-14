'use strict';

/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var employeesController = require('../../controllers/web').employees;
var router = express.Router();

router.get('/', employeesController.list);
router.post('/', employeesController.create);
router.post('/changeStatus/:employeeId', employeesController.changeStatus);
router.get('/:employeeId', employeesController.get);
router.post('/:employeeId', employeesController.update);

module.exports = router;