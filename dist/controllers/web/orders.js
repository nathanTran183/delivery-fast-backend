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
var _ = require('lodash');
var orderStatus = require('../../helpers/OrderStatus');
var FirebaseService = require('../../helpers/FirebaseService');

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
    getSubmittedList: function getSubmittedList(req, res) {
        res.render('orders/submittedIndex');
    },
    getProcessingList: function getProcessingList(req, res) {
        res.render('orders/processingIndex');
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
    getProcessingListJSON: function getProcessingListJSON(req, res) {
        Order.all({
            where: {
                $or: [{ status: "Processing" }, {
                    status: "Confirmed"
                }],
                employee_id: req.session.user.id
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
                    where: { status: statusObj.former },
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
                        req.flash('errors', { msg: "Order not found!" });
                        res.redirect('back');
                    }
                    order.update(req.body).then(function () {
                        req.flash('success', statusObj.msg);
                        if (req.body.status == 'Confirmed' && req.body.deliMan_id !== "" && req.body.deliMan_id) {
                            console.log("12345: " + order.id);
                            Notification.create({
                                order_id: order.id,
                                title: "Order is assigned",
                                body: "<i style='color: lawngreen;'>[Assign]</i> You has been assigned to a new order! Please confirm immediately!",
                                user_id: order.deliMan_id,
                                image_url: order.store.image_url
                            }).then(function (notification) {
                                console.log("----");
                                console.log("create assigned notification successfully");
                                // Send notification
                                var notiContent = {
                                    notification: {
                                        title: "New order waiting for Assignment Confirmation",
                                        body: "A new order is assigned to you. Please response immediately!"
                                    }
                                };

                                FirebaseService.pushNotification(notiContent, false).then(function (result) {
                                    console.log(result);
                                    req.flash('success', statusObj.msg + " - Send notification successfully");
                                }).catch(function (err) {
                                    req.flash('errors', { msg: err.message });
                                    res.redirect('back');
                                });
                            }).catch(function (err) {
                                return res.json(Response.returnError(err.message, err.code));
                            });
                        }
                        if (req.body.status == 'Cancelled') {
                            Notification.create({
                                order_id: req.params.orderId,
                                title: "Order is 'Cancelled'",
                                body: "<i style='color:red'>[Cancelled]</i> Your order is cancelled by 'Delivery Fast' at <b>" + order.store.name + "</b>. Thank you for using our service!",
                                image_url: order.store.image_url,
                                user_id: order.user_id
                            }).then(function (notification) {
                                console.log("----");
                                console.log("create Cancelled notification successfully");
                            }).catch(function (err) {
                                return res.json(Response.returnError(err.message, err.code));
                            });
                        }
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