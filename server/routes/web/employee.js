/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const employeesController = require('../../controllers/web').employees;
const router = express.Router();
const passport = require('../../middlewares/passport');

router.get('/', passport.isAdminWeb, employeesController.list);
router.post('/', passport.isAdminWeb, employeesController.create);
router.get('/deliMansJSON', passport.notUserWeb, employeesController.getDeliMansJSON);
router.post('/changeStatus/:employeeId', passport.isAdminWeb, employeesController.changeStatus);
router.get('/:employeeId', passport.isAdminWeb, employeesController.get);
router.post('/:employeeId', passport.isAdminWeb, employeesController.update);

module.exports = router;