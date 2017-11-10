/**
 * Created by nathan on 06/11/2017.
 */
const Category = require('../../models/index').Category;
const Product = require('../../models/index').Product;
const Addon = require('../../models/index').Addon;
const ProductAddon = require('../../models/index').ProductAddon;
const validate = require('../../helpers/validate');

module.exports = {
    list(req, res) {
        Category
            .all({
                where: {
                    store_id: req.params.storeId
                },
                include: [
                    {
                        model: Product,
                        as: 'products'
                    },
                    {
                        model: Addon,
                        as: 'addons',
                        include: [
                            {
                                model: ProductAddon,
                                as: 'productAddons'
                            }
                        ]
                    }
                ]
            })
            .then(categories => {

            })
            .catch(err => {

            })
    },

    get(req, res) {
        Category
            .findById(req.params.categoryId,{
                include: [
                    {
                        model: Product,
                        as: 'products'
                    },
                    {
                        model: Addon,
                        as: 'addons',
                        include: [
                            {
                                model: ProductAddon,
                                as: 'productAddons'
                            }
                        ]
                    }
                ]
            })
            .then(category => {
                if(!category) {
                    req.flash('errors', {msg: "Category not found"});
                    res.redirect('back');
                }
                return res.render("categories/detail", {category: category});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    create(req, res) {
        req.assert('name', 'Category name is required!').notEmpty();
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        let category = Category.build(req.body);
        category.store_id = req.params.storeId;
        category
            .save()
            .then(category => {
                req.flash('success', 'Create category successfully!');
                return res.redirect('back');
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    update(req, res){
        req.assert('name', 'Category name is required!').notEmpty();
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Category
            .findById(req.params.categoryId)
            .then(category => {
                if(!category){
                    req.flash('errors', {msg: "Category not found"});
                    res.redirect('back');
                }
                category
                    .update({name: req.body.name})
                    .then(() => {
                        req.flash('success', 'Update category successfully!');
                        return res.redirect('back');
                    })
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    delete(req, res){
        Category
            .findById(req.params.categoryId)
            .then(category => {
                if(!category) {
                    req.flash('errors', {msg: 'Category not found'});
                    res.redirect('back');
                }
                category
                    .destroy()
                    .then(()=> {
                        req.flash('success', 'Delete category successfully!');
                        return res.redirect('back');
                    })
                    .catch(err => {
                        req.flash('errors', {msg: err.message});
                        res.redirect('back');
                    })
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    }
}