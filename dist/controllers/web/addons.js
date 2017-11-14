'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var Store = require('../../models/index').Store;
var Addon = require('../../models/index').Addon;
var validate = require('../../helpers/validate');

module.exports = {
    list: function list(req, res) {
        Addon.all({
            where: {
                store_id: req.params.storeId
            }
        }).then(function (categories) {}).catch(function (err) {});
    },
    get: function get(req, res) {
        Addon.findById(req.params.categoryId, {
            include: [{}]
        }).then(function (category) {}).catch(function (err) {});
    },
    create: function create(req, res) {
        req.assert('name', 'Addon name is required!').notEmpty();
        req.assert('role', 'Addon maximum product is required!').notEmpty();
        req.assert('role', 'Addon maximum product has been number only!').isNumeric();
        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        var addon = Addon.build(req.body);
        addon.category_id = req.params.categoryId;
        addon.save().then(function () {
            req.flash('success', 'Create addon successfully!');
            return res.redirect('back');
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    update: function update(req, res) {
        req.assert('name', 'Addon name is required!').notEmpty();
        req.assert('role', 'Addon maximum product is required!').notEmpty();
        req.assert('role', 'Addon maximum product has been number only!').isNumeric();
        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Addon.findById(req.params.addonId).then(function (addon) {
            if (!addon) {
                req.flash('errors', { msg: "Addon not found!" });
                res.redirect('back');
            }
            addon.update(req.body).then(function () {
                req.flash('success', 'Update addon successfully!');
                return res.redirect('back');
            }).catch(function (err) {
                console.log(err);
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            });
        }).catch(function (err) {
            console.log(err);
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    delete: function _delete(req, res) {
        Addon.findById(req.params.addonId).then(function (addon) {
            if (!addon) {
                req.flash('errors', { msg: "Addon not found!" });
                res.redirect('back');
            }
            addon.destroy().then(function () {
                req.flash('success', 'Delete addon successfully!');
                return res.redirect('back');
            }).catch(function (err) {
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    }
};