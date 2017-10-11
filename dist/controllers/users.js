'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var User = require('../models').User;
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var config = require('../config');

module.exports = {
    /*create(req, res) {
     return User
     .create({
     username: req.body.username,
     password: req.body.password,
     email: req.body.email,
      })
     .then(todo => res.status(201).json(user))
     .catch(error => res.status(400).json(error));
     },*/
    signUp: function signUp(req, res) {
        User.create(req.body).then(function (savedAccount) {
            var token = jwt.sign({
                id: savedAccount._id,
                expiresIn: config.expireTime
            }, config.jwtSecret);
            return res.json({
                profile: {
                    id: savedAccount._id,
                    username: savedAccount.username,
                    email: savedAccount.email
                },
                id_token: token
            });
        }).catch(function (error) {
            return res.status(400).json(error);
        });
    },
    signIn: function signIn(req, res) {
        User.findOne({
            where: {
                $or: [{ username: req.body.username }, { email: req.body.username }]
            }
        }).then(function (account) {
            if (account != null) account.comparePassword(req.body.password, function (err, result) {
                if (err) return res.json(err);
                if (result == true) {
                    var token = jwt.sign({
                        id: account.id,
                        expiresIn: config.expireTime
                    }, config.jwtSecret);
                    return res.json({
                        profile: {
                            id: account.id,
                            username: account.username,
                            email: account.email
                        },
                        id_token: token
                    });
                } else {
                    console.log(err);
                    return res.status(400).json({ message: 'Password is not correct!' });
                }
            });else return res.status(400).json({ message: 'Username or Email doesn\'t existed' });
        }).catch(function (err) {
            console.log(err);
            return res.status(400).json(err);
        });
    },
    updateInfo: function updateInfo(req, res) {
        var user = req.user;
        User.findById(user.id).then(function (user) {
            console.log(user);
            user.update(req.body).then(function (savedUser) {
                return res.json({
                    profile: {
                        id: savedUser.id,
                        username: savedUser.username,
                        email: savedUser.email
                    }
                });
            }).catch(function (e) {
                return res.status(400).json(e);
            });
        }).catch(function (e) {
            return res.status(400).json(e);
        });
    },
    viewProfile: function viewProfile(req, res) {
        var user = req.user;
        console.log(user);
        User.findById(user.id).then(function (user) {
            return res.json({
                profile: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        }).catch(function (e) {
            return res.status(400).json(e);
        });
    }
};