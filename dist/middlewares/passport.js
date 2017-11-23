'use strict';

var Response = require('../helpers/response');
var HTTPStatus = require('http-status');
var User = require('../models').User;
var Employee = require('../models').Employee;

module.exports = {
    isAdminAPI: async function isAdminAPI(req, res, next) {
        if (req.user) {
            if (req.user.role === 'Admin') {
                next();
            } else {
                return res.json(Response.returnError("Only Admin can access this route!", HTTPStatus.UNAUTHORIZED));
            }
        } else return res.json(Response.returnError("Should login with Admin account!", HTTPStatus.UNAUTHORIZED));
    },
    isUserAPI: async function isUserAPI(req, res, next) {
        if (req.user) {
            User.findById(req.user.id).then(function (user) {
                if (!user) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                if (user.status == false) return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                if (req.user.role === 'User') {
                    next();
                } else {
                    return res.json(Response.returnError("Only users can access the route!", HTTPStatus.UNAUTHORIZED));
                }
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        } else return res.json(Response.returnError("Should login with user account!", HTTPStatus.UNAUTHORIZED));
    },
    isAppAPI: async function isAppAPI(req, res, next) {
        if (req.user) {
            User.findById(req.user.id).then(function (user) {
                if (!user) {
                    Employee.findById(req.user.id).then(function (employee) {
                        if (!employee) return res.json(Response.returnError('DeliMan not found!', HTTPStatus.NOT_FOUND));
                        if (employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                        if (req.user.role === 'DeliMan') {
                            next();
                        } else {
                            return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                        }
                    }).catch(function (err) {
                        return res.json(Response.returnError(err.message, err.code));
                    });
                }
                if (user.status == false) return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                if (req.user.role === 'User') {
                    next();
                } else {
                    return res.json(Response.returnError("Only users can access the route!", HTTPStatus.UNAUTHORIZED));
                }
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        } else return res.json(Response.returnError("Should login with user account!", HTTPStatus.UNAUTHORIZED));
    },
    isDeliManAPI: async function isDeliManAPI(req, res, next) {
        if (req.user) {
            Employee.findById(req.user.id).then(function (employee) {
                if (!employee) return res.json(Response.returnError('DeliMan not found!', HTTPStatus.NOT_FOUND));
                if (employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                if (req.user.role === 'DeliMan') {
                    next();
                } else {
                    return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                }
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        } else return res.json(Response.returnError("Should login with DeliMan account!", HTTPStatus.UNAUTHORIZED));
    },
    notUserAPI: async function notUserAPI(req, res, next) {
        if (req.user) {
            Employee.findById(req.user.id).then(function (employee) {
                if (!employee) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                if (employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                if (req.user.role !== 'User' && req.user.role !== 'DeliMan') {
                    next();
                } else {
                    return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                }
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        } else return res.json(Response.returnError("Should login with not user account!", HTTPStatus.UNAUTHORIZED));
    },
    isAdminWeb: async function isAdminWeb(req, res, next) {
        var employee = req.session.user;
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
    notUserWeb: async function notUserWeb(req, res, next) {
        var employee = req.session.user;
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
    }
};