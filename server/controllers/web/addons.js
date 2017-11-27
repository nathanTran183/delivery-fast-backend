/**
 * Created by nathan on 06/11/2017.
 */
const Store = require('../../models/index').Store;
const Addon = require('../../models/index').Addon;
const validate = require('../../helpers/Validate');

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
        req.assert('name', 'Addon name is required!').notEmpty();
        req.assert('role', 'Addon maximum product is required!').notEmpty();
        req.assert('role', 'Addon maximum product has been number only!').isNumeric();
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        let addon = Addon.build(req.body);
        addon.category_id = req.params.categoryId;
        addon
            .save()
            .then(() => {
                req.flash('success', 'Create addon successfully!');
                return res.redirect('back');
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    update(req, res){
        req.assert('name', 'Addon name is required!').notEmpty();
        req.assert('role', 'Addon maximum product is required!').notEmpty();
        req.assert('role', 'Addon maximum product has been number only!').isNumeric();
        var errors = req.validationErrors();
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Addon
            .findById(req.params.addonId)
            .then(addon => {
                if(!addon){
                    req.flash('errors', {msg: "Addon not found!"});
                    res.redirect('back');
                }
                addon
                    .update(req.body)
                    .then(()=> {
                        req.flash('success', 'Update addon successfully!');
                        return res.redirect('back');
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('errors', {msg: err.message});
                        res.redirect('back');
                    })
            })
            .catch(err => {
                console.log(err);
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    delete(req, res){
        Addon
            .findById(req.params.addonId)
            .then(addon => {
                if(!addon){
                    req.flash('errors', {msg: "Addon not found!"});
                    res.redirect('back');
                }
                addon
                    .destroy()
                    .then(()=> {
                        req.flash('success', 'Delete addon successfully!');
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