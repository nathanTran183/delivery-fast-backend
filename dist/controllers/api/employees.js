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
var Response = require('../../helpers/Response');

module.exports = {
    signIn: function signIn(req, res) {
        Employee.findOne({
            where: {
                role: "DeliMan",
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
            if (!user) res.json(Response.returnError("DeliMan Not Found!", httpStatus.NOT_FOUND));
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
    updateStatus: function updateStatus(req, res) {
        var user = req.user;
        Employee.findById(user.id).then(function (deliMan) {
            if (!deliMan) {
                res.json(Response.returnError("DeliMan Not Found!", httpStatus.NOT_FOUND));
            }
            Order.all({
                where: {
                    deliMan_id: req.user.id,
                    status: { $ne: "Delivered" }
                }
            }).then(function (orders) {
                if (orders.length > 0) {
                    res.json(Response.returnError("Cannot change status because you have a pending order to process!", httpStatus.NOT_ACCEPTABLE));
                } else {
                    deliMan.update(req.body).then(function (savedUser) {
                        emitter.emit('reloadActiveDeliMan', { msg: 'Reload deliman' });
                        var data = {
                            user: savedUser
                        };
                        return res.json(Response.returnSuccess("Update information successfully", data));
                    }).catch(function (err) {
                        return res.json(Response.returnError(err.message, err.code));
                    });
                }
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
    changePassword: function changePassword(req, res) {
        if (req.body.old_password && req.body.new_password) {
            Employee.findById(req.user.id).then(function (user) {
                if (!user) {
                    res.json(Response.returnError("DeliMan not found!", httpStatus.NOT_FOUND));
                } else {
                    user.comparePassword(req.body.old_password, function (err, result) {
                        if (err) return res.json(Response.returnError(err.message, err.code));
                        if (result == true) {
                            user.update({ password: req.body.new_password }).then(function () {
                                return res.json(Response.returnSuccess("Change password successfully!", {}));
                            }).catch(function (err) {
                                return res.json(Response.returnError(err.message, err.code));
                            });
                        } else {
                            return res.json(Response.returnError('Old password is not correct!', httpStatus.BAD_REQUEST));
                        }
                    });
                }
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        } else return res.json(Response.returnError("Require new password and old password!", httpStatus.BAD_REQUEST));
    },
    forgotPassword: function forgotPassword(req, res) {
        if (req.body.email) {
            Employee.find({
                where: { email: req.body.email }
            }).then(function (user) {
                if (!user) res.json(Response.returnError("DeliMan not found!", httpStatus.NOT_FOUND));else {
                    var newPass = randomize('A0', 8);
                    user.update({ password: newPass }).then(function () {
                        var mailOptions = {
                            to: user.email,
                            from: '"DELIVERY FAST 👥" <support@deliveryfast.vn>',
                            subject: 'DeliveryFast DeliMan Password Reset',
                            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' + 'Your password has been reset:  ' + newPass + '\n\n' + 'If this is not your request! Please contact our customer service through this number: <b>+842363827698</b> for more information \n'
                        };
                        EmailService.sendNodeMailer(mailOptions, function (err) {
                            if (err) {
                                return res.json(Response.returnError(err.message, err.code));
                            }
                            res.json(Response.returnSuccess("An e-mail has been sent to " + user.email + " with further instructions!", {}));
                        });
                    }).catch(function (err) {
                        return res.json(Response.returnError(err.message, err.code));
                    });
                }
            });
        }
    }
};