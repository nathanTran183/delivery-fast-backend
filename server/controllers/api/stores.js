/**
 * Created by nathan on 17/10/2017.
 */
const Store = require('../../models/index').Store;
const StoreType = require('../../models/index').StoreType;
const Category = require('../../models/index').Category;
const Product = require('../../models/index').Product;
const Addon = require('../../models/index').Addon;
const ProductAddon = require('../../models/index').ProductAddon;
const Order = require('../../models/index').Order;
const OrderDetail = require('../../models/index').OrderDetail;
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
                    {
                        model: Category,
                        as: 'categories',
                        include: [
                            {
                                model: Product,
                                as: 'products',
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
                    }
                ]
            })
            .then(store => {
                if(!store)
                    return res.json(Response.returnError('Store not found!', httpStatus.NOT_FOUND));
                if(!req.user)
                    return res.json(Response.returnSuccess('Retrieve store successfully!', {store: store}))
                else {
                    Order
                        .find({
                            where: {
                                user_id: req.user.id,
                                status: 'Pending'
                            },
                            include: [
                                {
                                    model: OrderDetail,
                                    as: 'orderDetails'
                                }
                            ]
                        })
                        .then(order => {
                            if (!order) {
                                Order
                                    .create({order_date: Date.now(), user_id: req.user.id, store_id: req.params.storeId})
                                    .then(savedOrder => {
                                        return res.json(Response.returnSuccess("Retrieve store and pending order successfully!", {store: store, order: savedOrder}))
                                    })
                                    .catch(err => Response.returnError(err.message, err.code))
                            }
                            return res.json(Response.returnSuccess("Retrieve store and pending order successfully!", {store: store, order: order}));
                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
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
                    {
                        model: Category,
                        as: 'categories',
                        include: [
                            {
                                model: Product,
                                as: 'products',
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
                    }
                ]
            })
            .then(stores => {
                return res.json(Response.returnSuccess('Get list store successfully!', {stores: stores}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    storeTypeList(req, res) {
        StoreType
            .all()
            .then(list => {
                return res.json(Response.returnSuccess('Create store successfully!', {stores: list}));
            })
            .catch(err => res.json(Response.returnError(err.message,err.code)))
    }

}