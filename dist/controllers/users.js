'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var User = require('../models').User;
var UserPhone = require('../models').UserPhone;
var UserAddress = require('../models').UserAddress;
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var Response = require('../helpers/response');
var config = require('../config');

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
    list: function list(req, res) {
        return User.all({
            include: [{
                model: UserPhone,
                as: 'userPhones'
            }, {
                model: UserAddress,
                as: 'userAddress'
            }],
            offset: req.query.offset || 0,
            limit: req.query.limit || 10
        }).then(function (users) {
            return res.json(Response.returnSuccess("Get list of users successfully", { users: users }));
        }).catch(function (error) {
            res.send(Response.returnError(error.message, error.code));
        });
    },
    get: function get(req, res) {
        return User.findById(req.params.userId, {
            include: [{
                model: UserPhone,
                as: 'userPhones'
            }, {
                model: UserAddress,
                as: 'userAddress'
            }]
        }).then(function (user) {
            if (!user) {
                return res.json(Response.returnError('User Not Found', httpStatus.NOT_FOUND));
            }
            return res.status(200).json(Response.returnSuccess("Retrieve user successfully!", user));
        }).catch(function (error) {
            return res.send(Response.returnError(error.message, error.code));
        });
    },
    update: function update(req, res) {
        return User.findById(req.params.userId).then(function (user) {
            if (!user) {
                return res.json(Response.returnError('User Not Found', httpStatus.NOT_FOUND));
            }
            user.update({ status: req.body.status }).then(function (savedUser) {
                return res.json(Response.returnSuccess("Update user successfully!", { user: savedUser }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (error) {
            return res.send(Response.returnError(error.message, error.code));
        });
    },
    test: function test(req, res) {
        var date = new Date('1994-12-06T17:00:00.000Z');
        var dateReturn = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return res.json({ date: dateReturn });
    }
};