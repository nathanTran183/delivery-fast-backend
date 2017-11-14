'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var StoreType = require('../../models/index').StoreType;
var config = require('../../config/index');

module.exports = {
    list: function list(req, res) {
        StoreType.all().then(function (storetypes) {
            return res.render("storeTypes/index", { storetypes: storetypes });
        }).catch(function (err) {
            return res.json(err);
        });
    },


    // get(req, res) {
    //     StoreType
    //         .findById(req.params.storeTypeId)
    //         .then(storetype => {
    //             if (!storetype) {
    //                 return res.json(Response.returnError('Store type is not existed!', httpStatus.NOT_FOUND));
    //             }
    //             return res.json(Response.returnSuccess('Retrieve store type successfully!', {storetype: storetype}));
    //         })
    //         .catch(err => res.json(Response.returnError(err.message, err.code)))
    // },

    create: function create(req, res) {
        StoreType.create(req.body).then(function (storetype) {
            req.flash('success', 'Create type for store successfully!');
            return res.redirect('/storeTypes');
        }).catch(function (err) {
            return res.json(err);
        });
    },
    update: function update(req, res) {
        StoreType.findById(req.params.storeTypeId).then(function (storetype) {
            if (!storetype) {
                req.flash('reason-fail', 'Store type not found!');
                res.redirect('/storeTypes');
            } else {
                storetype.update(req.body).then(function (storetype) {
                    req.flash('success', 'Update type for store successfully!');
                    return res.redirect('/storeTypes');
                }).catch(function (err) {
                    return res.json(err);
                });
            }
        }).catch(function (err) {
            return res.json(err);
        });
    },
    delete: function _delete(req, res) {
        StoreType.findById(req.params.storeTypeId).then(function (storetype) {
            if (!storetype) {
                req.flash('reason-fail', 'Store type not found!');
                res.redirect('/storeTypes');
            } else {
                storetype.destroy().then(function () {
                    req.flash('success', 'Delete store type successfully!');
                    return res.redirect('/storeTypes');
                }).catch(function (err) {
                    return res.json(err);
                });
            }
        }).catch(function (err) {
            return res.json(err);
        });
    }
};