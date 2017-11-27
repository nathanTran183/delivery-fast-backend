/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Response = require('../../helpers/Response');
const config = require('../../config/index');
const randomize = require('randomatic');
const EmailService = require('../../helpers/EmailService');

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
                if (account != null) {
                    if (account.status == false) {
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
                    })
                }
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

    changePassword(req, res) {
        if (req.body.old_password && req.body.new_password) {
            User
                .findById(req.user.id)
                .then(user => {
                    if (!user) {
                        res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));
                    } else {
                        user.comparePassword(req.body.old_password, (err, result) => {
                            if (err) return res.json(Response.returnError(err.message, err.code));
                            if (result == true) {
                                user
                                    .update({password: req.body.new_password})
                                    .then(() => {
                                        return res.json(Response.returnSuccess("Change password successfully!", {}));
                                    })
                                    .catch(err => res.json(Response.returnError(err.message, err.code)));
                            } else {
                                return res.json(Response.returnError('Old password is not correct!', httpStatus.BAD_REQUEST));
                            }
                        })
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)));
        } else return res.json(Response.returnError("Require new password and old password!", httpStatus.BAD_REQUEST));
    },

    forgotPassword(req, res) {
        if (req.body.email) {
            User
                .find({
                    where: {email: req.body.email}
                })
                .then(user => {
                    if (!user)
                        res.json(Response.returnError("User not found!", httpStatus.NOT_FOUND));
                    else {
                        let newPass = randomize('A0', 8);
                        user
                            .update({password: newPass})
                            .then(() => {
                                var mailOptions = {
                                    to: user.email,
                                    from: '"DELIVERY FAST 👥" <support@deliveryfast.vn>',
                                    subject: 'DeliveryFast User Password Reset',
                                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                                    'Your password has been reset:  ' + newPass + '\n\n' +
                                    'If this is not your request! Please contact our customer service through this number: <b>+842363827698</b> for more information \n'
                                };
                                EmailService.sendNodeMailer(mailOptions, function (err) {
                                    if (err) {
                                        return res.json(Response.returnError(err.message, err.code));
                                    }
                                    res.json(Response.returnSuccess("An e-mail has been sent to " + user.email + " with further instructions!", {}));
                                });
                            })
                            .catch(err => res.json(Response.returnError(err.message, err.code)));
                    }
                })
        }
    }
};