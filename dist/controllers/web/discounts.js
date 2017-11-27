'use strict';

/**
 * Created by nathan on 12/11/2017.
 */
var Discount = require('../../models/index').Discount;
var Store = require('../../models/index').Store;
var config = require('../../config/index');
var randomize = require('randomatic');
var validate = require('../../helpers/Validate');
module.exports = {
    list: function list(req, res) {
        Discount.all({
            include: [{
                model: Store,
                as: 'store'
            }],
            order: 'start_date DESC'
        }).then(function (discounts) {
            Store.all({
                where: {
                    status: true
                }
            }).then(function (stores) {
                return res.render("orders/discount", { discounts: discounts, stores: stores });
            }).catch(function (err) {
                req.flash('reason-fail', err.message);
                res.redirect('/discounts');
            });
        }).catch(function (err) {
            req.flash('reason-fail', err.message);
            res.redirect('/discounts');
        });
    },
    create: function create(req, res) {
        console.log(req.body);
        req.assert('code', 'Discount code is required!').notEmpty();
        req.assert('percentage', 'Discount percentage is required!').notEmpty();
        req.assert('start_date', 'Discount start date is required!').notEmpty();
        req.assert('expire_date', 'Discount expire date is required!').notEmpty();
        req.assert('percentage', 'Discount percentage is number only!').isNumeric();
        var errors = req.validationErrors();
        if (validate.isDate(req.body.start_date) == false) {
            errors = validate.addErrorAssert("Start date must be date format!", errors);
        } else {
            var startDate = new Date(req.body.start_date);
            req.body.start_date = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate();
        }

        if (validate.isDate(req.body.expire_date) == false) {
            errors = validate.addErrorAssert("Expire date must be date format!", errors);
        } else {
            var expireDate = new Date(req.body.expire_date);
            req.body.expire_date = expireDate.getFullYear() + "/" + (expireDate.getMonth() + 1) + "/" + expireDate.getDate();
        }
        if (startDate != undefined) {
            var date = new Date();
            if (startDate <= date) {
                errors = validate.addErrorAssert("Start date must be greater than today!", errors);
            }
        }
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Discount.create(req.body).then(function (discount) {
            req.flash('success', 'Create discount successfully!');
            return res.redirect('/discounts');
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('/discounts');
        });
    },
    delete: function _delete(req, res) {
        Discount.findById(req.params.discountId).then(function (discount) {
            if (!discount) {
                req.flash('reason-fail', 'Discount not found!');
                res.redirect('/discounts');
            } else {
                discount.destroy().then(function () {
                    req.flash('success', 'Delete discount successfully!');
                    return res.redirect('/discounts');
                }).catch(function (err) {
                    return res.json(err);
                });
            }
        }).catch(function (err) {
            return res.json(err);
        });
    },
    generateCode: function generateCode(req, res) {
        return res.json(randomize('Aa0', 8));
    }
};