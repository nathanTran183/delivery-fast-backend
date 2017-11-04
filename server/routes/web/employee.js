/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const employeesController = require('../../controllers/web').employees;
const router = express.Router();

router.get('/', employeesController.list);
router.post('/', employeesController.create);
router.post('/changeStatus/:employeeId', employeesController.changeStatus);
router.get('/:employeeId', employeesController.get);
router.post('/:employeeId', employeesController.update);

module.exports = router;