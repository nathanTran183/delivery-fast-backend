'use strict';

/**
 * Created by nathan on 11/10/2017.
 */
var UserAddress = require('../models').UserAddress;
var httpStatus = require('http-status');
var config = require('../config');
var Response = require('../helpers/response');
module.exports = {
    list: function list(req, res) {
        var user = req.user;
        UserAddress.find({
            where: {
                user_id: user.id
            }
        }).then(function (address) {
            var data = {
                address: address
            };
            return res.json(Response.returnSuccess("Get list address successfully!", data));
        }).catch(function (error) {
            res.json(Response.returnError(error.message, error.code));
        });
    },
    add: function add(req, res) {
        var address = UserAddress.build(req.body);
        address.user_id = req.user.id;
        address.save().then(function (address) {
            var data = {
                address: address
            };
            res.json(Response.returnSuccess("Create address successfully", data));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    delete: function _delete(req, res) {
        UserAddress.findById(req.params.addressId).then(function (address) {
            if (!address) {
                return res.json(Response.returnError('Address Not Found', httpStatus.NOT_FOUND));
            }
            return address.destroy().then(function () {
                return res.json(Response.returnSuccess('Delete address successfully', {}));
            }).catch(function (error) {
                return res.json(Response.returnError(error.message, error.code));
            });
        }).catch(function (error) {
            return res.json(Response.returnError(error.message, error.code));
        });
    }
};