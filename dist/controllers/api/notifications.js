'use strict';

/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 11/10/2017.
 */
var Notification = require('../../models/index').Notification;
var httpStatus = require('http-status');
var config = require('../../config/index');
var Response = require('../../helpers/Response');
module.exports = {
    list: function list(req, res) {
        Notification.all({
            where: { user_id: req.user.id }
        }).then(function (notifications) {
            return res.json(Response.returnSuccess("Get list discounts successfully!", { notifications: notifications }));
        }).catch(function (error) {
            res.json(Response.returnError(error.message, error.code));
        });
    }
};