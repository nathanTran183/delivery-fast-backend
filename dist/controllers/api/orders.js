'use strict';

/**
 * Created by nathan on 08/11/2017.
 */
var Response = require('../../helpers/Response');
var httpStatus = require('http-status');
var Order = require('../../models/index').Order;
var OrderDetail = require('../../models/index').OrderDetail;
var User = require('../../models/index').User;
var UserPhone = require('../../models/index').UserPhone;
var UserAddress = require('../../models/index').UserAddress;
var Employee = require('../../models/index').Employee;
var Store = require('../../models/index').Store;
var Notification = require('../../models/index').Notification;

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
    }]
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
                            if (savedOrder.status == "Order Submitted") {
                                emitter.emit('reloadSubmittedOrder', { msg: 'Reload submitted order' });
                            }
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
        Order.findById(req.params.orderId, {
            include: [{
                model: User,
                as: 'user'
            }, {
                model: Store,
                as: 'store'
            }, {
                model: Employee,
                as: 'deliMan'
            }]
        }).then(function (order) {
            if (!order) {
                return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND));
            }
            if (req.body.status == "Cancelled" || req.body.status == "Delivered") req.body.delivery_date = new Date();
            if (req.body.deliMan_id == "") req.body.deliMan_id = null;
            order.update(req.body).then(function (savedOrder) {
                if (savedOrder.status == "Confirmed" && savedOrder.deliMan_id == null) {
                    emitter.emit('reloadPendingOrder', {
                        msg: 'DeliMan ' + req.body.deliMan.last_name + " " + req.body.deliMan.first_name + ' cancelled the assignment of order ' + savedOrder.id + '! Please assign another deliman'
                    });
                }
                if (savedOrder.status == "Delivered") {
                    Notification.create({
                        order_id: order.id,
                        title: "Order is completed",
                        body: "<i style='color: lawngreen'>[Completed]</i>" + order.deliMan.first_name + " " + order.deliMan.last_name + " has delivered your order at <b>" + order.store.name + "</b>. Thank you for using our service!",
                        user_id: order.user_id,
                        image_url: order.store.image_url
                    }).then(function (notification) {
                        console.log("----");
                        console.log("create delivered notification successfully");
                    }).catch(function (err) {
                        return res.json(Response.returnError(err.message, err.code));
                    });
                }
                return res.json(Response.returnSuccess("Update order's status successfully!", { order: savedOrder }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    history: function history(req, res) {
        var historyWhere = {
            status: { $in: ["Cancelled", "Delivered"] },
            user_id: req.user.id
        };
        var inComingWhere = {
            status: { $notIn: ["Delivered", "Cancelled", "Pending"] },
            user_id: req.user.id
        };
        if (req.query.startDate && req.query.endDate) {
            req.query.endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
            historyWhere.delivery_date = { $gt: req.query.startDate, $lt: req.query.endDate };
            inComingWhere.delivery_date = { $gt: req.query.startDate, $lt: req.query.endDate };
        }
        Order.all({
            where: historyWhere,
            attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
            order: [['updatedAt', 'DESC']],
            include: [{
                model: Store,
                as: 'store',
                attributes: ['name', 'address']
            }]
        }).then(function (orders) {
            Order.all({
                where: inComingWhere,
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            }).then(function (inComing) {
                return res.json(Response.returnSuccess("Get order history successfully!", {
                    history: orders,
                    inComing: inComing
                }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    getOrderList: function getOrderList(req, res) {
        var historyWhere = {
            status: { $in: ["Cancelled", "Delivered"] },
            deliMan_id: req.user.id
        };
        var inComingWhere = {
            status: { $notIn: ["Delivered", "Cancelled", "Pending"] },
            deliMan_id: req.user.id
        };
        if (req.query.startDate && req.query.endDate) {
            req.query.endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
            historyWhere.delivery_date = { $gt: req.query.startDate, $lt: req.query.endDate };
            inComingWhere.delivery_date = { $gt: req.query.startDate, $lt: req.query.endDate };
        }
        Order.all({
            where: historyWhere,
            attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
            order: [['updatedAt', 'DESC']],
            include: [{
                model: Store,
                as: 'store',
                attributes: ['name', 'address']
            }]
        }).then(function (orders) {
            Order.all({
                where: inComingWhere,
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            }).then(function (inComing) {
                return res.json(Response.returnSuccess("Get order history successfully!", {
                    history: orders,
                    inComing: inComing
                }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    }
};