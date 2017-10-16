/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const employeesController = require('../controllers').employees;
const router = express.Router();
const config = require('../config/index');

//DeliMans' routers
router.post('/signIn', expressJwt({ secret: config.jwtSecret }),employeesController.signIn);

//All employees' routers
router.get('/profile', expressJwt({ secret: config.jwtSecret }),employeesController.viewProfile);
router.post('/updateInfo', expressJwt({ secret: config.jwtSecret }),employeesController.updateInfo);

router.get('/', expressJwt({ secret: config.jwtSecret }),employeesController.list);
router.post('/', expressJwt({ secret: config.jwtSecret }),employeesController.create);
router.get('/:employeeId', expressJwt({ secret: config.jwtSecret }),employeesController.get);
router.put('/:employeeId', expressJwt({ secret: config.jwtSecret }),employeesController.update);

module.exports = router;