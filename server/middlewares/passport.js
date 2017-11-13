const Response = require('../helpers/response');
const HTTPStatus = require('http-status');
const User = require('../models').User;
const Employee = require('../models').Employee;

module.exports = {
    async isAdminAPI(req, res, next) {
        if (req.user) {
            if (req.user.role === 'Admin') {
                next();
            } else {
                return res.json(Response.returnError("Only Admin can access this route!", HTTPStatus.UNAUTHORIZED));
            }
        }
        else return res.json(Response.returnError("Should login with Admin account!", HTTPStatus.UNAUTHORIZED))
    },

    async isUserAPI(req, res, next) {
        if (req.user) {
            User
                .findById(req.user.id)
                .then(user => {
                    if (!user) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                    if (user.status == false) return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                    if (req.user.role === 'User') {
                        next();
                    } else {
                        return res.json(Response.returnError("Only users can access the route!", HTTPStatus.UNAUTHORIZED));
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)))
        }
        else return res.json(Response.returnError("Should login with user account!", HTTPStatus.UNAUTHORIZED))
    },

    async isDeliManAPI(req, res, next) {
        if (req.user) {
            Employee
                .findById(req.user.id)
                .then(employee => {
                    if (!employee) return res.json(Response.returnError('DeliMan not found!', HTTPStatus.NOT_FOUND));
                    if (employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                    if (req.user.role === 'DeliMan') {
                        next();
                    } else {
                        return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)))
        } else return res.json(Response.returnError("Should login with DeliMan account!", HTTPStatus.UNAUTHORIZED))
    },

    async notUserAPI(req, res, next) {
        if (req.user) {
            Employee
                .findById(req.user.id)
                .then(employee => {
                    if (!employee) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                    if (employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                    if (req.user.role !== 'User' && req.user.role !== 'DeliMan') {
                        next();
                    } else {
                        return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)))
        } else return res.json(Response.returnError("Should login with not user account!", HTTPStatus.UNAUTHORIZED))
    },

    async isAdminWeb(req, res, next) {
        let employee = req.session.user;
        if (employee) {
            if (employee.status == 'Deactivated') {
                req.flash('reason_fail', "Your account has been deactivated!");
                req.session.user = null;
                res.redirect('/signIn');
            }
            if (employee.role == 'Admin') {
                next();
            } else {
                req.flash('notAuthorized', "Users cannot access the route!");
                req.session.user = null;
                res.redirect('/signIn');
            }
        } else {
            req.flash('reason_fail', "You need to login with not user account first!");
            res.redirect('/signIn');
        }
    },

    async notUserWeb(req, res, next) {
        let employee = req.session.user;
        if (employee) {
            if (employee.status == 'Deactivated') {
                req.flash('reason_fail', "Your account has been deactivated!");
                req.session.user = null;
                res.redirect('/signIn');
            }
            if (employee.role == 'Admin' || employee.role == 'Staff') {
                next();
            } else {
                req.flash('notAuthorized', "Users cannot access the route!");
                req.session.user = null;
                res.redirect('/signIn');
            }
        } else {
            req.flash('reason_fail', "You need to login with not user account first!");
            res.redirect('/signIn');
        }
    },
};