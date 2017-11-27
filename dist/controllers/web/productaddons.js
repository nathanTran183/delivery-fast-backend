'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var Store = require('../../models/index').Store;
var ProductAddon = require('../../models/index').ProductAddon;
var validate = require('../../helpers/Validate');

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
        req.assert('name', 'Product addon\'s name is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is only number!').isNumeric();

        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        ProductAddon.create(req.body).then(function () {
            req.flash('success', 'Create product addon successfully!');
            return res.redirect('back');
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    update: function update(req, res) {
        req.assert('name', 'Product addon\'s name is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is only number!').isNumeric();

        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        ProductAddon.findById(req.params.productAddonId).then(function (productAddon) {
            if (!productAddon) {
                req.flash('errors', { msg: "Product Addon not found!" });
                res.redirect('back');
            }
            productAddon.update(req.body).then(function () {
                req.flash('success', 'Update Product Addon successfully!');
                return res.redirect('back');
            }).catch(function (err) {
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    delete: function _delete(req, res) {
        ProductAddon.findById(req.params.productAddonId).then(function (productAddon) {
            if (!productAddon) {
                req.flash('errors', { msg: "Product Addon not found!" });
                res.redirect('back');
            }
            productAddon.destroy().then(function () {
                req.flash('success', 'Delete Product Addon successfully!');
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