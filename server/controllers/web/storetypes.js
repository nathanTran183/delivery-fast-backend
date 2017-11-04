/**
 * Created by nathan on 17/10/2017.
 */
const StoreType = require('../../models/index').StoreType;
const config = require('../../config/index');

module.exports = {
    list(req, res) {
        StoreType
            .all()
            .then(storetypes => {
                return res.render("storeTypes/index", {storetypes: storetypes})
            })
            .catch(err => res.json(err))
    },

    get(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if (!storetype) {
                    return res.json(Response.returnError('Store type is not existed!', httpStatus.NOT_FOUND));
                }
                return res.json(Response.returnSuccess('Retrieve store type successfully!', {storetype: storetype}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    create(req, res) {
        StoreType
            .create(req.body)
            .then(storetype => {
                req.flash('success', 'Create type for store successfully!');
                return res.redirect('/storeTypes');
            })
            .catch(err => res.json(err))
    },

    update(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if (!storetype) {
                    req.flash('reason-fail', 'Store type not found!');
                    res.redirect('/storeTypes');
                } else {
                    storetype
                        .update(req.body)
                        .then(storetype => {
                            req.flash('success', 'Update type for store successfully!');
                            return res.redirect('/storeTypes');
                        })
                        .catch(err => res.json(err))
                }
            })
            .catch(err => res.json(err))
    },

    delete(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if (!storetype) {
                    req.flash('reason-fail', 'Store type not found!');
                    res.redirect('/storeTypes');
                } else {
                    storetype
                        .destroy()
                        .then(() => {
                            req.flash('success', 'Delete store type successfully!');
                            return res.redirect('/storeTypes');
                        })
                        .catch(err => res.json(err))
                }
            })
            .catch(err => res.json(err))
    }
}