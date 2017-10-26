/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const employeesController = require('../../controllers/web').employees;
const router = express.Router();
const passport = require('../../middlewares/passport');

router.get('/', passport.isAdminWeb, employeesController.list);
router.post('/', passport.isAdminWeb, employeesController.create);
router.get('/:employeeId', passport.isAdminWeb, employeesController.get);
router.put('/:employeeId', passport.isAdminWeb, employeesController.update);

module.exports = router;