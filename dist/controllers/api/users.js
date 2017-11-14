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
    }
};