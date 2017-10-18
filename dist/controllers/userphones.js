'use strict';

/**
 * Created by nathan on 11/10/2017.
 */
var UserPhone = require('../models').UserPhone;
var httpStatus = require('http-status');
var Response = require('../helpers/response');
var config = require('../config');

module.exports = {
    list: function list(req, res) {
        var user = req.user;
        UserPhone.all({
            where: {
                user_id: user.id
            }
        }).then(function (phones) {
            console.log(phones);
            return res.json(Response.returnSuccess('Get phone numbers of user', { phones: phones }));
        }).catch(function (error) {
            res.json(Response.returnError(error.message, error.code));
        });
    },
    add: function add(req, res) {
        UserPhone.find({
            where: {
                phone_number: req.body.phone_number
            }
        }).then(function (phones) {
            if (!phones) {
                UserPhone.find({
                    where: {
                        user_id: req.user.id
                    }
                }).then(function (userPhones) {
                    var userPhone = UserPhone.build({
                        phone_number: req.body.phone_number,
                        user_id: req.user.id
                    });
                    if (!userPhones) {
                        userPhone.role = true;
                    } else userPhone.role = false;
                    userPhone.save().then(function (phoneSaved) {
                        return res.status(200).json(Response.returnSuccess('Add new phone number successfully!', { phone: phoneSaved }));
                    }).catch(function (err) {
                        return res.json(Response.returnError(err.message, err.code));
                    });
                }).catch(function (err) {
                    return res.json(Response.returnError(err.message, err.code));
                });
            } else return res.json(Response.returnError('This phone number has been existed', httpStatus.BAD_REQUEST));
        }).catch(function (error) {
            return res.json(Response.returnError(error.message, error.code));
        });
    },
    setPrimary: function setPrimary(req, res) {
        UserPhone.find({ user_id: req.user.id, role: true }).then(function (phone) {
            if (phone) phone.update({ role: false }).then().catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
            UserPhone.findById(req.params.phoneId).then(function (userPhone) {
                if (!userPhone) return res.json(Response.returnError('Phone number not found!', httpStatus.NOT_FOUND));
                userPhone.update({ role: true }).then(function (phoneSaved) {
                    return res.json(Response.returnSuccess("Set phone number becoming Primary successfully!", { phone: phoneSaved }));
                }).catch(function (err) {
                    return res.json(Response.returnError(err.message, err.code));
                });
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    delete: function _delete(req, res) {
        UserPhone.find({
            where: {
                id: req.params.phoneId,
                user_id: req.user.id
            }
        }).then(function (phone) {
            if (!phone) {
                return res.json(Response.returnError('Phone Not Found', httpStatus.NOT_FOUND));
            }
            if (phone.role == true) {
                return res.json(Response.returnError('Primary Phone cannot be deleted!', httpStatus.BAD_REQUEST));
            }
            return phone.destroy().then(function () {
                return res.json(Response.returnSuccess('Delete phone number successfully', {}));
            }).catch(function (error) {
                return res.json(Response.returnError(error.message, error.code));
            });
        }).catch(function (error) {
            return res.json(Response.returnError(error.message, error.code));
        });
    }
};