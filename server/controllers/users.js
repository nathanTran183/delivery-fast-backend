/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../models').User;
const UserPhone  = require('../models').UserPhone;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config');

module.exports = {
    signUp(req, res) {
        User
            .create(req.body).then(savedAccount => {
            const token = jwt.sign({
                id: savedAccount.id,
                expiresIn: config.expireTime
            }, config.jwtSecret);
            return res.json({
                profile: {
                    id: savedAccount.id,
                    username: savedAccount.username,
                    email: savedAccount.email,
                },
                id_token: token
            })
        })
            .catch(error => {
                return res.status(400).json(error);
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
                        if (err) return res.json(err);
                        if (result == true) {
                            const token = jwt.sign({
                                id: account.id,
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            return res.json({
                                profile: {
                                    id: account.id,
                                    username: account.username,
                                    email: account.email,
                                },
                                id_token: token
                            });
                        } else {
                            console.log(err);
                            return res.status(400).json({message: 'Password is not correct!'});
                        }
                    })
                else return res.status(400).json({message: 'Username or Email doesn\'t existed'});
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            })
    },

    updateInfo(req, res) {
        let user = req.user;
        User
            .findById(user.id)
            .then((user) => {
                console.log(user);
                user
                    .update(req.body)
                    .then(savedUser => {
                        return res.json({
                            profile: {
                                id: savedUser.id,
                                username: savedUser.username,
                                email: savedUser.email,
                            }
                        })
                    })
                    .catch(e => res.status(400).json(e))
            })
            .catch(e => res.status(400).json(e));
    },

    viewProfile(req, res) {
        let user = req.user;
        console.log(user);
        User
            .findById(user.id)
            .then((user) => {
                return res.json({
                    profile: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                    }
                })
            })
            .catch(e => res.status(400).json(e));
    },

    list(req, res) {
        return User
            .all({
                include: [{
                    model: UserPhone,
                    as: 'userPhone',
                }],
                offset: req.query.offset || 0,
                limit: req.query.limit || 10
            })
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    },

    get(req, res) {
        return User
            .findById(req.params.userId, {
                include: [{
                    model: UserPhone,
                    as: 'userPhone',
                }],
            })
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                return res.status(200).send(user);
            })
            .catch(error => res.status(400).send(error));
    },

    update(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.status(404).send({
                        message: 'User Not Found',
                    });
                }
                console.log(user);
                user
                    .update(req.body)
                    .then(savedUser => {
                        return res.json({
                            profile: {
                                user: savedUser
                            }
                        })
                    })
                    .catch(e => res.status(400).json(e))
            })
            .catch(error => res.status(400).send(error));
    }
};