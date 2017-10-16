/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../models').User;
const UserPhone = require('../models').UserPhone;
const UserAddress = require('../models').UserAddress;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config');

module.exports = {
    signUp(req, res) {
        User
            .create(req.body)
            .then(savedAccount => {
                const token = jwt.sign({
                    id: savedAccount.id,
                    role: 'User',
                    expiresIn: config.expireTime
                }, config.jwtSecret);
                return res.status(200).json({
                    status: true,
                    message: "Signup successfully!",
                    data: {
                        id_token: token,
                        user: {
                            id: savedAccount.id,
                            username: savedAccount.username,
                            email: savedAccount.email
                        }
                    }
                })
            })
            .catch(error => {
                return res.json({
                    status: false,
                    message: error.message,
                });
            });
    },

    signIn(req, res) {
        User
            .findOne({
                where: {
                    $or: [{username: req.body.username}, {email: req.body.username}]
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
                                role: 'User',
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            return res.json({
                                status: true,
                                message: "Signin successfully!",
                                data: {
                                    user: {
                                        id: account.id,
                                        username: account.username,
                                        email: account.email,
                                    },
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
        User
            .findById(user.id)
            .then((user) => {
                user
                    .update(req.body)
                    .then(savedUser => {
                        return res.json({
                            status: true,
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
        let user = req.user;
        console.log(user);
        User
            .findById(user.id, {
                include: [
                    {
                        model: UserPhone,
                        as: 'userPhones',
                    },
                    {
                        model: UserAddress,
                        as: 'userAddress',
                    }
                ]
            })
            .then((user) => {
                return res.json({
                    status: true,
                    data: {
                        user: user
                    }
                })
            })
            .catch(e => res.status(400).json(e));
    },

    list(req, res) {
        return User
            .all({
                include: [
                    {
                        model: UserPhone,
                        as: 'userPhones',
                    },
                    {
                        model: UserAddress,
                        as: 'userAddress',
                    }
                ],
                offset: req.query.offset || 0,
                limit: req.query.limit || 10
            })
            .then(users => res.json({
                status: true,
                message: "get list of users successfully",
                data: {
                    users: users
                }
            }))
            .catch(error => {
                res.status(400).send(error)
            });
    },

    get(req, res) {
        return User
            .findById(req.params.userId, {
                include: [
                    {
                        model: UserPhone,
                        as: 'userPhones',
                    },
                    {
                        model: UserAddress,
                        as: 'userAddress',
                    }],
            })
            .then(user => {
                if (!user) {
                    return res.json({
                        status: false,
                        message: 'User Not Found',
                    });
                }
                return res.status(200).json(user);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.json({
                        status: false,
                        message: 'User Not Found'
                    });
                }
                user
                    .update({status: req.body.status})
                    .then(savedUser => {
                        return res.json({
                            status: true,
                            message: "Update user successfully!",
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
            .catch(error => res.status(400).send(error));
    }
};