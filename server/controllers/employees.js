/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../models').Employee;
const config = require('../config');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Response = require('../helpers/response');

module.exports = {

    signIn(req, res) {
        Employee
            .findOne({
                where: {
                    $or: [{username: req.body.username}, {email: req.body.username}, {phone_number: req.body.phone_number}]
                }
            })
            .then(account => {
                if (account != null)
                    account.comparePassword(req.body.password, (err, result) => {
                        if (err) return res.json(Response.returnError(err.message, httpStatus.BAD_REQUEST));
                        if (result == true) {
                            const token = jwt.sign({
                                id: account.id,
                                role: account.role,
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            let data = {
                                user: account,
                                id_token: token
                            }
                            return res.json(Response.returnSuccess("Signin successfully!", data));
                        } else {
                            return res.json(Response.returnError('Password is not correct!', httpStatus.BAD_REQUEST));
                        }
                    })
                else return res.json(Response.returnError('Username or Email doesn\'t existed', httpStatus.NOT_FOUND));
            })
            .catch(err => {
                return res.json(Response.returnError(err.message, err.code));
            })
    },

    updateInfo(req, res) {
        let user = req.user;
        Employee
            .findById(user.id)
            .then((user) => {
                user
                    .update(req.body)
                    .then(savedUser => {
                        let data = {
                            user: savedUser
                        }
                        return res.json(Response.returnSuccess("Update information successfully", data));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    viewProfile(req, res) {
        let employee = req.user;
        Employee
            .findById(employee.id)
            .then((employee) => {
                if (!employee) {
                    return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
                }
                let data = {
                    employee: employee
                };
                return res.json(Response.returnSuccess("Retrieve employee information successfully!", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    list(req, res) {
        Employee
            .all({
                where: {
                    role: {
                        $ne: 'Admin'
                    }
                }
            })
            .then(employees => {
                let data = {
                    employees: employees
                };
                return res.json(Response.returnSuccess("get list of employees successfully", data));
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code))
            });
    },

    get(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
                }
                let data = {
                    employee: employee
                };
                return res.status(200).json(Response.returnSuccess("Retrieve employee successfully!", data));
            })
            .catch(error => res.json(Response.returnError(error.message, error.code)));
    },

    create(req, res) {
        Employee
            .create(req.body)
            .then(employee => {
                let data = {
                    employee: employee
                };
                return res.json(Response.returnSuccess("Create employee successfully!", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    return res.json(Response.returnError("Employee not found!", httpStatus.NOT_FOUND))
                } else {
                    employee
                        .update(req.body)
                        .then(employee => {
                            let data = {
                                employee: employee
                            };
                            return res.json(Response.returnSuccess("Update employee successfully!", data))
                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    }
}