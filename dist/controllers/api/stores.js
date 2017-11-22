'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var Store = require('../../models/index').Store;
var StoreType = require('../../models/index').StoreType;
var Category = require('../../models/index').Category;
var Product = require('../../models/index').Product;
var Addon = require('../../models/index').Addon;
var ProductAddon = require('../../models/index').ProductAddon;
var Order = require('../../models/index').Order;
var OrderDetail = require('../../models/index').OrderDetail;
var UserPhone = require('../../models/index').UserPhone;
var UserAddress = require('../../models/index').UserAddress;
var Response = require('../../helpers/response');
var httpStatus = require('http-status');

var associationObject = {
    where: {
        status: true
    },
    include: [{
        model: StoreType,
        as: 'storeTypes',
        attributes: ['id', 'type'],
        through: { attributes: [] }
    }, {
        model: Category,
        as: 'categories',
        include: [{ model: Product, as: 'products' }, {
            model: Addon,
            as: 'addons',
            include: [{ model: ProductAddon, as: 'productAddons' }]
        }]
    }]
};
module.exports = {
    get: function get(req, res) {
        Store.findById(req.params.storeId, associationObject).then(function (store) {
            if (!store) return res.json(Response.returnError('Store not found!', httpStatus.NOT_FOUND));
            if (!req.user) return res.json(Response.returnSuccess('Retrieve store successfully!', { store: store }));else {
                Order.find({
                    where: {
                        user_id: req.user.id,
                        store_id: store.id,
                        status: 'Pending'
                    },
                    include: [{
                        model: OrderDetail,
                        as: 'orderDetails'
                    }]
                }).then(function (order) {
                    if (!order) {
                        Order.create({ user_id: req.user.id, store_id: req.params.storeId, payment: "Cash" }).then(function (savedOrder) {

                            return res.json(Response.returnSuccess("Retrieve store and pending order successfully!", {
                                store: store,
                                order: savedOrder
                            }));
                        }).catch(function (err) {
                            res.json(Response.returnError(err.message, err.code));
                        });
                    } else return res.json(Response.returnSuccess("Retrieve store and pending order successfully!", {
                        store: store,
                        order: order
                    }));
                }).catch(function (err) {
                    return res.json(Response.returnError(err.message, err.code));
                });
            }
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    list: function list(req, res) {
        Store.all(associationObject).then(function (stores) {
            return res.json(Response.returnSuccess('Get list store successfully!', { stores: stores }));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    search: function search(req, res) {
        var querySearch = req.query.search;
        Store.all({
            include: [{
                model: StoreType,
                as: 'storeTypes',
                attributes: ['id', 'type'],
                through: { attributes: [] }
            }, {
                model: Category,
                as: 'categories',
                include: [{ model: Product, as: 'products' }, { model: Addon, as: 'addons', include: [{ model: ProductAddon, as: 'productAddons' }] }]
            }],
            where: {
                $or: [{ name: { $ilike: '%' + querySearch + '%' } }, { '$storeTypes.type$': { $ilike: '%' + querySearch + '%' } }, { '$categories.name$': { $ilike: '%' + querySearch + '%' } }, { '$categories.products.name$': { $ilike: '%' + querySearch + '%' } }]
            }
        }).then(function (stores) {
            res.json(Response.returnSuccess("Search store successfully!", { stores: stores }));
        }).catch(function (err) {
            res.json(Response.returnError(err.message, err.code));
        });
    },
    testing: function testing(req, res) {
        console.log('aaa');
        StoreType.all().then(function (storeType) {
            return res.json(Response.returnSuccess("okay", { stores: storeType }));
        }).catch(function (err) {
            return res.json(err);
        });
    }
};