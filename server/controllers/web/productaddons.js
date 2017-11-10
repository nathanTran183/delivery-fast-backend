/**
 * Created by nathan on 06/11/2017.
 */
const Store = require('../../models/index').Store;
const ProductAddon = require('../../models/index').ProductAddon;
const validate = require('../../helpers/validate');

module.exports = {
    list(req, res) {
        Addon
            .all({
                where: {
                    store_id: req.params.storeId
                }
            })
            .then(categories => {

            })
            .catch(err => {

            })
    },

    get(req, res) {
        Addon
            .findById(req.params.categoryId,{
                include: [
                    {

                    }
                ]
            })
            .then(category => {

            })
            .catch(err => {

            })
    },

    create(req, res) {
        req.assert('name', 'Product addon\'s name is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is only number!').isNumeric();

        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        ProductAddon
            .create(req.body)
            .then(() => {
                req.flash('success', 'Create product addon successfully!');
                return res.redirect('back');
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    update(req, res){
        req.assert('name', 'Product addon\'s name is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is required!').notEmpty();
        req.assert('price', 'Product addon\'s price is only number!').isNumeric();

        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        ProductAddon
            .findById(req.params.productAddonId)
            .then(productAddon => {
                if(!productAddon){
                    req.flash('errors', {msg: "Product Addon not found!"});
                    res.redirect('back');
                }
                productAddon
                    .update(req.body)
                    .then(()=> {
                        req.flash('success', 'Update Product Addon successfully!');
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
    },

    delete(req, res){
        ProductAddon
            .findById(req.params.productAddonId)
            .then(productAddon => {
                if(!productAddon){
                    req.flash('errors', {msg: "Product Addon not found!"});
                    res.redirect('back');
                }
                productAddon
                    .destroy()
                    .then(()=> {
                        req.flash('success', 'Delete Product Addon successfully!');
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