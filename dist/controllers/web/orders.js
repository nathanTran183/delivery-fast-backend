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
var _ = require('lodash');
var orderStatus = require('../../helpers/orderStatus');

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
    getSubmittedList: function getSubmittedList(req, res) {
        res.render('orders/submittedIndex');
    },
    getProcessingList: function getProcessingList(req, res) {
        Order.all({
            where: {
                $or: [{ status: "Processing" }, {
                    status: "Confirmed",
                    deliMan_id: { $eq: null }
                }],
                employee_id: req.session.user.id
            }
        }).then(function (orders) {
            res.render('orders/processingIndex', { orders: orders });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    getSubmittedListJSON: function getSubmittedListJSON(req, res) {
        Order.all({
            where: {
                status: 'Order Submitted'
            },
            order: [['updatedAt']]
        }).then(function (orders) {
            return res.json(Response.returnSuccess("Get submitted order list successfully!", { orders: orders }));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    update: function update(req, res) {
        if (req.body.status) {
            var statusObj = _.find(orderStatus, { latter: req.body.status });
            if (statusObj != null && statusObj != undefined) {
                if (req.body.deliMan_id != "" && req.body.deliMan_id != null) {
                    statusObj = {
                        former: 'Confirmed',
                        latter: 'Confirmed',
                        msg: 'Order is assigned! Verify order successfully!!',
                        url: '/orders/submitted'
                    };
                }
                Order.findById(req.params.orderId, {
                    where: { status: statusObj.former }
                }).then(function (order) {
                    if (!order) {
                        req.flash('errors', { msg: "Order not found!" });
                        res.redirect('back');
                    }
                    order.update(req.body).then(function () {
                        req.flash('success', statusObj.msg);
                        if (req.body.status == 'Processing' || req.body.status == 'Confirmed' && (req.body.deliMan_id == "" || req.body.deliMan_id == null)) res.redirect(statusObj.url + req.params.orderId);else res.redirect(statusObj.url);
                    }).catch(function (err) {
                        req.flash('errors', { msg: err.message });
                        res.redirect('back');
                    });
                }).catch(function (err) {
                    req.flash('errors', { msg: err.message });
                    res.redirect('back');
                });
            } else {
                req.flash('errors', { msg: 'Order status is invalid' });
                res.redirect('back');
            }
        } else {
            req.flash('errors', { msg: 'Order status must be contain to update!' });
            res.redirect('back');
        }
    },
    getSubmitted: function getSubmitted(req, res) {
        Order.findById(req.params.orderId, {
            where: { status: "Processing" },
            include: [{
                model: OrderDetail,
                as: 'orderDetails'
            }, {
                model: User,
                as: 'user'
            }, {
                model: Store,
                as: 'store'
            }]
        }).then(function (order) {
            if (!order) {
                req.flash('errors', { msg: "Order not found!" });
                res.redirect('back');
            }
            res.render('orders/submittedDetail', { order: order });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    getProcessing: function getProcessing(req, res) {
        Order.findById(req.params.orderId, { where: { status: "confirmed" } }).then(function (order) {
            if (!order) {
                req.flash('errors', { msg: "Order not found!" });
                res.redirect('back');
            }
            res.render('orders/confirmedDetail', { orderId: req.params.orderId });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    get: function get(req, res) {
        Order.findById(req.params.orderId, associationObject).then(function (order) {
            if (!order) {
                req.flash('errors', { msg: "Order not found!" });
                res.redirect('back');
            }
            res.render('orders/orderDetail', { order: order });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    list: function list(req, res) {
        Order.all({
            order: [['updatedAt', 'DESC']]
        }).then(function (orders) {
            res.render('orders/orderIndex', { orders: orders });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('/orders/submitted');
        });
    },
    getHistoryJSON: function getHistoryJSON(req, res) {
        Order.all({
            where: {
                status: { $in: ["Cancelled", "Picked", "Assigned", "Delivered"] },
                employee_id: req.session.user.id
            },
            include: [{
                model: Employee,
                as: 'deliMan'
            }]
        }).then(function (orders) {
            return res.json(Response.returnSuccess("Get order history successfully!", { orders: orders }));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    history: function history(req, res) {
        res.render('orders/orderHistory');
    }
};