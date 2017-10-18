'use strict';

/**
 * Created by nathan on 16/10/2017.
 */
var Employee = require('../models').Employee;
var config = require('../config');
var httpStatus = require('http-status');
var jwt = require('jsonwebtoken');
var Response = require('../helpers/response');

module.exports = {
    signIn: function signIn(req, res) {
        Employee.findOne({
            where: {
                $or: [{ username: req.body.username }, { email: req.body.username }, { phone_number: req.body.phone_number }]
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
    },
    list: function list(req, res) {
        Employee.all().then(function (employees) {
            var data = {
                employees: employees
            };
            return res.json(Response.returnSuccess("get list of employees successfully", data));
        }).catch(function (error) {
            res.json(Response.returnError(error.message, error.code));
        });
    },
    get: function get(req, res) {
        Employee.findById(req.params.employeeId).then(function (employee) {
            if (!employee) {
                return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
            }
            var data = {
                employee: employee
            };
            return res.status(200).json(Response.returnSuccess("Retrieve employee successfully!", data));
        }).catch(function (error) {
            return res.json(Response.returnError(error.message, error.code));
        });
    },
    create: function create(req, res) {
        Employee.create(req.body).then(function (employee) {
            var data = {
                employee: employee
            };
            return res.json(Response.returnSuccess("Create employee successfully!", data));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    update: function update(req, res) {
        Employee.findById(req.params.employeeId).then(function (employee) {
            if (!employee) {
                return res.json(Response.returnError("Employee not found!", httpStatus.NOT_FOUND));
            } else {
                employee.update(req.body).then(function (employee) {
                    var data = {
                        employee: employee
                    };
                    return res.json(Response.returnSuccess("Update employee successfully!", data));
                }).catch(function (err) {
                    return res.json(Response.returnError(err.message, err.code));
                });
            }
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    }
};