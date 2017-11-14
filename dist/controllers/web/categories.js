'use strict';

/**
 * Created by nathan on 06/11/2017.
 */
var Category = require('../../models/index').Category;
var Product = require('../../models/index').Product;
var Addon = require('../../models/index').Addon;
var ProductAddon = require('../../models/index').ProductAddon;
var validate = require('../../helpers/validate');

module.exports = {
    list: function list(req, res) {
        Category.all({
            where: {
                store_id: req.params.storeId
            },
            include: [{
                model: Product,
                as: 'products'
            }, {
                model: Addon,
                as: 'addons',
                include: [{
                    model: ProductAddon,
                    as: 'productAddons'
                }]
            }]
        }).then(function (categories) {}).catch(function (err) {});
    },
    get: function get(req, res) {
        Category.findById(req.params.categoryId, {
            include: [{
                model: Product,
                as: 'products'
            }, {
                model: Addon,
                as: 'addons',
                include: [{
                    model: ProductAddon,
                    as: 'productAddons'
                }]
            }]
        }).then(function (category) {
            if (!category) {
                req.flash('errors', { msg: "Category not found" });
                res.redirect('back');
            }
            return res.render("categories/detail", { category: category });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    create: function create(req, res) {
        req.assert('name', 'Category name is required!').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        var category = Category.build(req.body);
        category.store_id = req.params.storeId;
        category.save().then(function (category) {
            req.flash('success', 'Create category successfully!');
            return res.redirect('back');
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    update: function update(req, res) {
        req.assert('name', 'Category name is required!').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Category.findById(req.params.categoryId).then(function (category) {
            if (!category) {
                req.flash('errors', { msg: "Category not found" });
                res.redirect('back');
            }
            category.update({ name: req.body.name }).then(function () {
                req.flash('success', 'Update category successfully!');
                return res.redirect('back');
            });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    delete: function _delete(req, res) {
        Category.findById(req.params.categoryId).then(function (category) {
            if (!category) {
                req.flash('errors', { msg: 'Category not found' });
                res.redirect('back');
            }
            category.destroy().then(function () {
                req.flash('success', 'Delete category successfully!');
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