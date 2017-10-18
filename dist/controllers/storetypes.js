'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var StoreType = require('../models').StoreType;
var config = require('../config');
var jwt = require('jsonwebtoken');
var Response = require('../helpers/response');

module.exports = {
    list: function list(req, res) {
        StoreType.all().then(function (storetypes) {
            return res.json(Response.returnSuccess("Get list store type successfully!", storetypes));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    get: function get(req, res) {
        StoreType.find({});
    },
    create: function create(req, res) {
        StoreType.create(req.body).then(function (type) {
            return res.json({
                status: true,
                message: "Create type for store successfully!",
                data: {
                    type: type
                }
            });
        }).catch(function (err) {
            return res.json({
                status: false,
                message: err.message
            });
        });
    },
    update: function update(req, res) {},
    delete: function _delete(req, res) {}
};