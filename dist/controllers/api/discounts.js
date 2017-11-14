'use strict';

/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 11/10/2017.
 */
var Discount = require('../../models/index').Discount;
var httpStatus = require('http-status');
var config = require('../../config/index');
var Response = require('../../helpers/response');
module.exports = {
    check: function check(req, res) {
        var storeId = req.query.storeId;
        var code = req.query.code;
        var date = new Date();
        // res.json(new Date("2017-11-12T17:00:00.000Z").toLocaleString())
        if (storeId == undefined || code == undefined) {
            return res.json(Response.returnError("Require Store id and discount code"));
        } else {
            Discount.find({
                where: {
                    store_id: storeId,
                    code: code
                }
            }).then(function (discount) {
                if (!discount) return res.json(Response.returnError("Invalid code!"), httpStatus.BAD_REQUEST);else {
                    var expireDate = new Date(discount.expire_date);
                    expireDate.setHours(23, 59, 59, 999);
                    if (discount.start_date < new Date() && expireDate > new Date()) return res.json(Response.returnSuccess("Code is valid", {}));else res.json(Response.returnError("Code is expired or not applied yet!", httpStatus.BAD_REQUEST));
                }
            }).catch(function (error) {
                res.json(Response.returnError(error.message, error.code));
            });
        }
    },
    list: function list(req, res) {
        Discount.all().then(function (discount) {
            return res.json(Response.returnSuccess("Get list discounts successfully!", discount));
        }).catch(function (error) {
            res.json(Response.returnError(error.message, error.code));
        });
    }
};