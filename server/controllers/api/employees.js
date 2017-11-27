/**
 * Created by nathan on 16/10/2017.
 */
const Employee = require('../../models/index').Employee;
const Order = require('../../models/index').Order;
const Store = require('../../models/index').Store;
const config = require('../../config/index');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Response = require('../../helpers/Response');

module.exports = {

    signIn(req, res) {
        Employee
            .findOne({
                where: {
                    role: "DeliMan",
                    $or: [{username: req.body.username}, {email: req.body.username}, {phone_number: req.body.username}]
                }
            })
            .then(account => {
                if (account != null)
                    account.comparePassword(req.body.password, (err, result) => {
                        if (err) return res.json(Response.returnError(err.message, httpStatus.BAD_REQUEST));
                        if (result == true) {
                            const token = jwt.sign({
                                id: account.id,
                                role: account.role,
                                expiresIn: config.expireTime
                            }, config.jwtSecret);
                            let data = {
                                user: account,
                                id_token: token
                            }
                            return res.json(Response.returnSuccess("Signin successfully!", data));
                        } else {
                            return res.json(Response.returnError('Password is not correct!', httpStatus.BAD_REQUEST));
                        }
                    })
                else return res.json(Response.returnError('Username or Email doesn\'t existed', httpStatus.NOT_FOUND));
            })
            .catch(err => {
                return res.json(Response.returnError(err.message, err.code));
            })
    },

    updateInfo(req, res) {
        let user = req.user;
        Employee
            .findById(user.id)
            .then((user) => {
                user
                    .update(req.body)
                    .then(savedUser => {
                        let data = {
                            user: savedUser
                        }
                        return res.json(Response.returnSuccess("Update information successfully", data));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    updateStatus(req, res) {
        let user = req.user;
        Employee
            .findById(user.id)
            .then((deliMan) => {
                deliMan
                    .update(req.body)
                    .then(savedUser => {
                            emitter.emit('reloadActiveDeliMan', {msg: 'Reload deliman'});
                        let data = {
                            user: savedUser
                        };
                        return res.json(Response.returnSuccess("Update information successfully", data));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    viewProfile(req, res) {
        let employee = req.user;
        Employee
            .findById(employee.id)
            .then((employee) => {
                if (!employee) {
                    return res.json(Response.returnError('Employee Not Found', httpStatus.NOT_FOUND));
                }
                let data = {
                    employee: employee
                };
                return res.json(Response.returnSuccess("Retrieve employee information successfully!", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)));
    },

    changePassword(req, res) {
        if (req.body.old_password && req.body.new_password) {
            Employee
                .findById(req.user.id)
                .then(user => {
                    if (!user) {
                        res.json(Response.returnError("DeliMan not found!", httpStatus.NOT_FOUND));
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
            Employee
                .find({
                    where: {email: req.body.email}
                })
                .then(user => {
                    if (!user)
                        res.json(Response.returnError("DeliMan not found!", httpStatus.NOT_FOUND));
                    else {
                        let newPass = randomize('A0', 8);
                        user
                            .update({password: newPass})
                            .then(() => {
                                var mailOptions = {
                                    to: user.email,
                                    from: '"DELIVERY FAST 👥" <support@deliveryfast.vn>',
                                    subject: 'DeliveryFast DeliMan Password Reset',
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
}