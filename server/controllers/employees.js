/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../models').Employee;
const config = require('../config');

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
                        if (err) return res.json({
                            status: false,
                            message: err
                        });
                        if (result == true) {
                            const token = jwt.sign({
                                id: account.id,
                                role: account.role,
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            return res.json({
                                status: true,
                                message: "Signin successfully!",
                                data: {
                                    user: account,
                                    id_token: token
                                }
                            });
                        } else {
                            return res.json({
                                status: false,
                                message: 'Password is not correct!'
                            });
                        }
                    })
                else return res.json({
                    status: false,
                    message: 'Username or Email doesn\'t existed'
                });
            })
            .catch(err => {
                return res.json({
                    status: false,
                    message: err.message
                });
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
                        return res.json({
                            status: true,
                            message: "Update information successfully",
                            data: {
                                user: savedUser
                            }
                        })
                    })
                    .catch(e => res.json({
                        status: false,
                        message: e.message
                    }))
            })
            .catch(e => res.status(400).json(e));
    },

    viewProfile(req, res) {
        let employee = req.user;
        Employee
            .findById(employee.id)
            .then((employee) => {
                if (!employee) {
                    return res.json({
                        status: false,
                        message: 'Employee Not Found',
                    });
                }
                return res.json({
                    status: true,
                    message: "Retrieve employee information successfully!",
                    data: {
                        employee: employee
                    }
                })
            })
            .catch(e => res.status(400).json(e));
    },

    list(req, res) {
        Employee
            .all()
            .then(employees => res.json({
                status: true,
                message: "get list of employees successfully",
                data: {
                    employees: employees
                }
            }))
            .catch(error => {
                res.status(400).send(error)
            });
    },

    get(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if (!employee) {
                    return res.json({
                        status: false,
                        message: 'Employee Not Found',
                    });
                }
                return res.status(200).json({
                    status: true,
                    message: "Retrieve employee successfully!",
                    data: {
                        employee: employee
                    }
                });
            })
            .catch(error => res.status(400).send(error));
    },

    create(req, res) {
        Employee
            .create(req.body)
            .then(employee => {
                return res.json({
                    status: true,
                    message: "Create employee successfully!",
                    data: {
                        employee: employee
                    }
                })
            })
            .catch(err => res.json({
                status: false,
                message: err.message
            }))
    },

    update(req, res) {
        Employee
            .findById(req.params.employeeId)
            .then(employee => {
                if(!employee){
                    return res.json({
                        status: false,
                        message: "Employee not found!"
                    })
                } else {
                    employee
                        .update(req.body)
                        .then(employee => {
                            return res.json({
                                status: true,
                                message: "Update employee successfully!",
                                data: {
                                    employee: employee
                                }
                            })
                        })
                        .catch(err => res.json({
                            status: false,
                            message: err.message
                        }))
                }
            })
            .catch(err => res.status(400).json(err))
    }
}