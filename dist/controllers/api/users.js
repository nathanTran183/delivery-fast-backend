'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var User = require('../../models/index').User;
var UserPhone = require('../../models/index').UserPhone;
var UserAddress = require('../../models/index').UserAddress;
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var Response = require('../../helpers/response');
var config = require('../../config/index');
var randomize = require('randomatic');
var EmailService = require('../../helpers/EmailService');

module.exports = {
    signUp: function signUp(req, res) {
        User.create(req.body).then(function (savedAccount) {
            var token = jwt.sign({
                id: savedAccount.id,
                role: 'User',
                expiresIn: config.expireTime
            }, config.jwtSecret);
            var data = {
                id_token: token,
                user: {
                    id: savedAccount.id,
                    username: savedAccount.username,
                    email: savedAccount.email
                }
            };
            return res.status(200).json(Response.returnSuccess("Signup successfully!", data));
        }).catch(function (error) {
            return res.json(Response.returnError(error.message, error.code));
        });
    },
    signIn: function signIn(req, res) {
        User.findOne({
            where: {
                $or: [{ username: req.body.username }, { email: req.body.username }]
            }
        }).then(function (account) {
            if (account != null) {
                if (account.status == false) {
                    return res.json(Response.returnError("This account has been deactivated!", httpStatus.UNAUTHORIZED));
                }
                account.comparePassword(req.body.password, function (err, result) {
                    if (err) return res.json(Response.returnError(err.message, err.code));
                    if (result == true) {
                        var token = jwt.sign({
                            id: account.id,
                            role: 'User',
                            expiresIn: config.expireTime
                        }, config.jwtSecret);
                        var data = {
                            user: {
                                id: account.id,
                                username: account.username,
                                email: account.email
                            },
                            id_token: token
                        };
                        return res.json(Response.returnSuccess("Signin successfully!", data));
                    } else {
                        return res.json(Response.returnError('Password is not correct!', httpStatus.BAD_REQUEST));
                    }
                });
            } else return res.json(Response.returnError('Username or Email doesn\'t existed', httpStatus.NOT_FOUND));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    updateInfo: function updateInfo(req, res) {
        var user = req.user;
        User.findById(user.id).then(function (user) {
            user.update(req.body).then(function (savedUser) {
                var data = {
                    user: savedUser
                };
                return res.json(Response.returnSuccess("Update user info successfully!", data));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    viewProfile: function viewProfile(req, res) {
        var user = req.user;
        User.findById(user.id, {
            include: [{
                model: UserPhone,
                as: 'userPhones'
            }, {
                model: UserAddress,
                as: 'userAddress'
            }]
        }).then(function (user) {
            if (!user) {
                return res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));
            }
            var data = {
                user: user
            };
            return res.json(Response.returnSuccess("Retrieve user info successfully!", data));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    changePassword: function changePassword(req, res) {
        if (req.body.old_password && req.body.new_password) {
            User.findById(req.user.id).then(function (user) {
                if (!user) {
                    res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));
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
            User.find({
                where: { email: req.body.email }
            }).then(function (user) {
                if (!user) res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));else {
                    var newPass = randomize('A0', 8);
                    user.update({ password: newPass }).then(function () {
                        var mailOptions = {
                            to: user.email,
                            from: '"DELIVERY FAST 👥" <support@deliveryfast.vn>',
                            subject: 'DeliveryFast User Password Reset',
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