'use strict';

/**
 * Created by nathan on 16/10/2017.
 */
var Employee = require('../../models/index').Employee;
var Order = require('../../models/index').Order;
var Store = require('../../models/index').Store;
var config = require('../../config/index');
var httpStatus = require('http-status');
var jwt = require('jsonwebtoken');
var Response = require('../../helpers/response');

module.exports = {
    signIn: function signIn(req, res) {
        Employee.findOne({
            where: {
                $or: [{ username: req.body.username }, { email: req.body.username }, { phone_number: req.body.username }]
            }
        }).then(function (account) {
            if (account != null) account.comparePassword(req.body.password, function (err, result) {
                if (err) return res.json(Response.returnError(err.message, httpStatus.BAD_REQUEST));
                if (result == true) {
                    var token = jwt.sign({
                        id: account.id,
                        role: account.role,
                        expiresIn: config.expireTime
                    }, config.jwtSecret);
                    var data = {
                        user: account,
                        id_token: token
                    };
                    return res.json(Response.returnSuccess("Signin successfully!", data));
                } else {
                    return res.json(Response.returnError('Password is not correct!', httpStatus.BAD_REQUEST));
                }
            });else return res.json(Response.returnError('Username or Email doesn\'t existed', httpStatus.NOT_FOUND));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    updateInfo: function updateInfo(req, res) {
        var user = req.user;
        Employee.findById(user.id).then(function (user) {
            user.update(req.body).then(function (savedUser) {
                var data = {
                    user: savedUser
                };
                return res.json(Response.returnSuccess("Update information successfully", data));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    viewProfile: function viewProfile(req, res) {
        var employee = req.user;
        Employee.findById(employee.id).then(function (employee) {
            if (!employee) {
                return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
            }
            var data = {
                employee: employee
            };
            return res.json(Response.returnSuccess("Retrieve employee information successfully!", data));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    }
};