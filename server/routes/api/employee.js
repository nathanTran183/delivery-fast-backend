/**
 * Created by nathan on 14/10/2017.
 */
const express = require('express');
const expressJwt = require('express-jwt');
const employeesController = require('../../controllers/api').employees;
const router = express.Router();
const config = require('../../config/index');
const passport = require('../../middlewares/passport');

//DeliMans' routers
router.post('/signIn', employeesController.signIn);

//All employees' routers
router.get('/profile', [expressJwt({secret: config.jwtSecret}), passport.isDeliManAPI], employeesController.viewProfile);
router.post('/updateInfo', [expressJwt({secret: config.jwtSecret}), passport.isDeliManAPI], employeesController.updateInfo);


module.exports = router;