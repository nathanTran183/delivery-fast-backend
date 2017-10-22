/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const employeesController = require('../../controllers/web').employees;
const router = express.Router();
const config = require('../../config/index');
const passport = require('../../middlewares/passport');

router.get('/', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], employeesController.list);
router.post('/', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], employeesController.create);
router.get('/:employeeId', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], employeesController.get);
router.put('/:employeeId', [expressJwt({secret: config.jwtSecret}), passport.isAdminWeb], employeesController.update);

module.exports = router;