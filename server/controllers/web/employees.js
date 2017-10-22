/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../../models/index').Employee;
const config = require('../../config/index');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Response = require('../../helpers/response');

module.exports = {

    signIn (req, res, next) {
        return res.render('user/signIn');
    },

    postSignIn(req, res, next) {
        // check validation
        req.assert('password', 'A valid password (length between 6 to 48) is required').len(6, 48);  //Validate password
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('/signIn');
            return;
        }

        Employee
            .findOne({
                where: {
                    $or: [{username: req.body.username}, {email: req.body.username}, {phone_number: req.body.phone_number}]
                }
            })
            .then(account => {
                if (account != null) {
                    if(account.status == false) {
                        req.flash('reason_fail', 'Your account has been deactivated!');
                        res.redirect('/signIn');
                        return;
                    }

                    account.comparePassword(req.body.password, (err, result) => {
                        if (err) return next({status: 500, body: err});
                        if (result == true) {
                            if (req.body.rememberme ) {
                                req.session.cookie.maxAge = 2592000000;
                            } else {
                                req.session.cookie.expires = false;
                            }
                            req.session.user = account;
                            res.redirect('/profile');
                        } else {
                            req.flash('reason_fail', 'Password is not correct!');
                            res.redirect('/signIn');
                            return;
                        }
                    })
                }
                else {
                    req.flash('reason_fail', 'Username or Email doesn\'t existed!');
                    res.redirect('/signIn');
                    return;
                }
            })
            .catch(err => {
                return res.json(Response.returnError(err.message, err.code));
            })
    },

    logout (req, res, next) {
        req.session.privilegeAdmin = null;
        req.session.user = null;
        res.redirect('/signIn');
    },

    profile: function (req, res, next) {
        res.render('user/profile');
    },

    // forgotPassword (req, res,next){
    //     res.render('user/forgotPassword');
    // },

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
    },
}