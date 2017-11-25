'use strict';

/**
 * Created by nathan on 14/10/2017.
 */
var express = require('express');
var employeesController = require('../../controllers/web').employees;
var router = express.Router();
var passport = require('../../middlewares/passport');

router.get('/', passport.isAdminWeb, employeesController.list);
router.get('/blackList', passport.isAdminWeb, employeesController.blackList);
router.post('/', passport.isAdminWeb, employeesController.create);
router.get('/deliMansJSON', passport.notUserWeb, employeesController.getDeliMansJSON);
router.post('/changeStatus/:employeeId', passport.isAdminWeb, employeesController.changeStatus);
router.get('/:employeeId', passport.isAdminWeb, employeesController.get);
router.post('/:employeeId', passport.isAdminWeb, employeesController.update);

module.exports = router;