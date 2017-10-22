/**
 * Created by nathan on 17/10/2017.
 */
const Store = require('../../models/index').Store;
const StoreType = require('../../models/index').StoreType;
const Response = require('../../helpers/response');
const httpStatus = require('http-status');

module.exports = {
    get(req, res) {
        Store
            .findById(req.params.storeId, {
                include: [
                    {
                        model: StoreType,
                        as: 'storeTypes',
                        attributes: ['id','type'],
                        through: {
                            attributes: []
                        }
                    },
                ]
            })
            .then(store => {
                if(!store)
                    return res.json(Response.returnError('Store not found!', httpStatus.NOT_FOUND));
                return res.json(Response.returnSuccess('Retrieve store successfully!', {store: store}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    list(req, res) {
        Store
            .all({
                include: [
                    {
                        model: StoreType,
                        as: 'storeTypes',
                        attributes: ['id','type'],
                        through: {
                            attributes: []
                        }
                    },
                ]
            })
            .then(stores => {
                return res.json(Response.returnSuccess('Get list store successfully!', {stores: stores}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    create(req, res) {
        Store
            .create(req.body)
            .then(store => {
                return res.json(Response.returnSuccess('Create store successfully!', {store: store}));
            })
            .catch(err => res.json(Response.returnError(err.message,err.code)))
    },

}