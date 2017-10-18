/**
 * Created by nathan on 17/10/2017.
 */
const StoreType = require('../models').StoreType;
const config = require('../config');
const Response = require('../helpers/response');
const httpStatus = require('http-status');
module.exports  = {
    list(req, res) {
        StoreType
            .all()
            .then(storetypes => {
                return res.json(Response.returnSuccess("Get list store type successfully!",storetypes))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    get(req, res) {
        StoreType
            .findById(req.params.storeTypeId)
            .then(storetype => {
                if(!storetype){
                    return res.json(Response.returnError('Store type is not existed!', httpStatus.NOT_FOUND));
                }
                return res.json(Response.returnSuccess('Retrieve store type successfully!', storetype));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    create(req, res) {
        StoreType
            .create(req.body)
            .then(storetype => {
                return res.json(Response.returnSuccess("Create type for store successfully!", storetype))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {

    },

    delete(req, res) {

    }
}