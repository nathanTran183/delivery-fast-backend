/**
 * Created by nathan on 17/10/2017.
 */
const StoreType = require('../../models/index').StoreType;
const config = require('../../config/index');
const Response = require('../../helpers/response');
const httpStatus = require('http-status');
module.exports = {
    list(req, res) {
        StoreType
            .all()
            .then(storetypes => {
                return res.json(Response.returnSuccess("Get list store type successfully!", {storetypes: storetypes}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
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
                return res.json(Response.returnSuccess("Create type for store successfully!", {storetype: storetype}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if (!storetype) {
                    return res.json(Response.returnError("Store type not found!", httpStatus.NOT_FOUND))
                } else {
                    storetype
                        .update(req.body)
                        .then(storetype => {
                            return res.json(Response.returnSuccess("Update type for store successfully!", {storetype: storetype}))
                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    delete(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if (!storetype) {
                    return res.json(Response.returnError("Store type not found!", httpStatus.NOT_FOUND))
                } else {
                    storetype
                        .destroy()
                        .then(() => {
                            return res.json(Response.returnSuccess("Delete store type successfully!", {}))
                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    }
}