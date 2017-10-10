/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../models').User;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config');

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
    signUp(req, res) {
        User
            .create(req.body).then(savedAccount => {
            const token = jwt.sign({
                id: savedAccount._id,
                expiresIn: config.expireTime
            }, config.jwtSecret);
            return res.json({
                profile: {
                    id: savedAccount._id,
                    username: savedAccount.username,
                    email: savedAccount.email,
                },
                id_token: token
            })
        })
            .catch(error => {
                console.log(error);
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
                        let err = new Error('Password is not correct!');
                        console.log(err);
                        return res.status(400).json(err);
                    }
                })
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
};