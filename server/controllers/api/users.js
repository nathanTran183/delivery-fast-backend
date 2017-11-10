/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Response = require('../../helpers/response');
const config = require('../../config/index');

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
                let data = {
                    id_token: token,
                    user: {
                        id: savedAccount.id,
                        username: savedAccount.username,
                        email: savedAccount.email
                    }
                };
                return res.status(200).json(Response.returnSuccess("Signup successfully!", data));
            })
            .catch(error => {
                return res.json(Response.returnError(error.message, error.code));
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
                if (account != null){
                    if(account.status == false){
                        return res.json(Response.returnError("This account has been deactivated!", httpStatus.UNAUTHORIZED))
                    }
                    account.comparePassword(req.body.password, (err, result) => {
                        if (err) return res.json(Response.returnError(err.message, err.code));
                        if (result == true) {
                            const token = jwt.sign({
                                id: account.id,
                                role: 'User',
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            let data = {
                                user: {
                                    id: account.id,
                                    username: account.username,
                                    email: account.email,
                                },
                                id_token: token
                            };
                            return res.json(Response.returnSuccess("Signin successfully!", data));
                        } else {
                            return res.json(Response.returnError('Password is not correct!', httpStatus.BAD_REQUEST));
                        }
                    })}
                else return res.json(Response.returnError('Username or Email doesn\'t existed', httpStatus.NOT_FOUND));
            })
            .catch(err => {
                return res.json(Response.returnError(err.message, err.code));
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
                        let data = {
                            user: savedUser
                        };
                        return res.json(Response.returnSuccess("Update user info successfully!", data));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    viewProfile(req, res) {
        let user = req.user;
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
            .then(user => {
                if (!user) {
                    return res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));
                }
                let data = {
                    user: user
                };
                return res.json(Response.returnSuccess("Retrieve user info successfully!", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },



};