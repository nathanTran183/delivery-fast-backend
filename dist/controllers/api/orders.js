'use strict';

/**
 * Created by nathan on 08/11/2017.
 */
var Response = require('../../helpers/response');
var httpStatus = require('http-status');
var Order = require('../../models/index').Order;
var OrderDetail = require('../../models/index').OrderDetail;
var User = require('../../models/index').User;
var UserPhone = require('../../models/index').UserPhone;
var UserAddress = require('../../models/index').UserAddress;
var Employee = require('../../models/index').Employee;
var Store = require('../../models/index').Store;

var associationObject = {
    include: [{
        model: OrderDetail,
        as: 'orderDetails'
    }, {
        model: User,
        as: 'user',
        include: [{
            model: UserPhone,
            as: 'userPhones'
        }, {
            model: UserAddress,
            as: 'userAddress'
        }]
    }, {
        model: Store,
        as: 'store'
    }, {
        model: Employee,
        as: 'staff'
    }, {
        model: Employee,
        as: 'deliMan'
    }], attributes: {
        exclude: ['user_id', 'store_id', 'employee_id', 'deliMan_id']
    }
};

module.exports = {
    get: function get(req, res) {
        Order.findById(req.params.orderId, associationObject).then(function (order) {
            if (!order) {
                return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND));
            }
            return res.json(Response.returnSuccess("Get order successfully!", { order: order }));
        }).catch(function (err) {
            return Response.returnError(err.message, err.code);
        });
    },
    list: function list(req, res) {
        Order.all(associationObject).then(function (orders) {
            return res.json(Response.returnSuccess("Get list order successfully", { orders: orders }));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },


    // create(req, res) {
    //     req.body.user_id = req.user.id;
    //     Order
    //         .create(req.body, {
    //             include: [{
    //                 model: OrderDetail,
    //                 as: 'orderDetails'
    //             }]
    //         })
    //         .then(order => {
    //             res.json(order)
    //         })
    //         .catch(err => res.json(Response.returnError(err.message, err.code)))
    //
    // },

    updateClient: function updateClient(req, res) {
        Order.findById(req.params.orderId).then(function (order) {
            if (!order) {
                return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND));
            }
            order.update(req.body).then(function (savedOrder) {
                OrderDetail.destroy({
                    where: {
                        order_id: savedOrder.id
                    }
                }).then(function () {
                    if (req.body.orderDetails && req.body.orderDetails.length > 0) {
                        OrderDetail.bulkCreate(req.body.orderDetails).then(function (orderDetails) {
                            return res.json(Response.returnSuccess("Update order successfully!", {
                                order: savedOrder,
                                orderDetails: orderDetails
                            }));
                        }).catch(function (err) {
                            return res.json(Response.returnError(err.message, err.code));
                        });
                    } else return res.json(Response.returnSuccess("Update order successfully!", {
                        order: savedOrder,
                        orderDetails: null
                    }));
                }).catch(function (err) {
                    return res.json(Response.returnError(err.message, err.code));
                });
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    updateStatus: function updateStatus(req, res) {
        Order.findById(req.params.orderId).then(function (order) {
            if (!order) {
                return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND));
            }
            var query = { status: req.body.status };
            if (req.body.status == "Cancelled" || req.body.status == "Delivered") query = { status: req.body.status, delivery_date: new Date() };
            order.update(query).then(function (savedOrder) {
                return res.json(Response.returnSuccess("Update order's status successfully!", { order: savedOrder }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    history: function history(req, res) {
        Order.all({
            where: {
                status: { $in: ["Cancelled", "Delivered"] },
                user_id: req.user.id
            },
            attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
            order: [['updatedAt', 'DESC']],
            include: [{
                model: Store,
                as: 'store',
                attributes: ['name', 'address']
            }]
        }).then(function (orders) {
            Order.all({
                where: {
                    status: { $notIn: ["Delivered", "Cancelled", "Pending"] },
                    user_id: req.user.id
                },
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            }).then(function (inComing) {
                return res.json(Response.returnSuccess("Get order history successfully!", { history: orders, inComing: inComing }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    }
};