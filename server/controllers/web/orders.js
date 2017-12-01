/**
 * Created by nathan on 08/11/2017.
 */
const Response = require('../../helpers/Response');
const httpStatus = require('http-status');
const Order = require('../../models/index').Order;
const OrderDetail = require('../../models/index').OrderDetail;
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const Employee = require('../../models/index').Employee;
const Store = require('../../models/index').Store;
const Notification = require('../../models/index').Notification;
const _ = require('lodash');
const orderStatus = require('../../helpers/OrderStatus');
const FirebaseService = require('../../helpers/FirebaseService');

var associationObject = {
    include: [
        {
            model: OrderDetail,
            as: 'orderDetails'
        }, {
            model: User,
            as: 'user',
            include: [
                {
                    model: UserPhone,
                    as: 'userPhones',
                },
                {
                    model: UserAddress,
                    as: 'userAddress',
                }
            ]
        }, {
            model: Store,
            as: 'store'
        }, {
            model: Employee,
            as: 'staff'
        }, {
            model: Employee,
            as: 'deliMan'
        }
    ]
};

module.exports = {
    getSubmittedList(req, res){
        res.render('orders/submittedIndex');
    },

    getProcessingList(req, res) {
        res.render('orders/processingIndex');
    },

    getSubmittedListJSON(req, res){
        Order
            .all({
                where: {
                    status: 'Order Submitted',
                },
                order: [['updatedAt']]
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get submitted order list successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    getProcessingListJSON(req, res){
        Order
            .all({
                where: {
                    $or: [
                        {status: "Processing"},
                        {
                            status: "Confirmed",
                        }
                    ],
                    employee_id: req.session.user.id
                },
                order: [['updatedAt']]

            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get submitted order list successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {
        if (req.body.status) {
            let statusObj = _.find(orderStatus, {latter: req.body.status});
            if (statusObj != null && statusObj != undefined) {
                if (req.body.deliMan_id != "" && req.body.deliMan_id != null) {
                    statusObj = {
                        former: 'Confirmed',
                        latter: 'Confirmed',
                        msg: 'Order is assigned! Verify order successfully!!',
                        url: '/orders/submitted',
                    }
                }
                Order
                    .findById(req.params.orderId, {
                        where: {status: statusObj.former},
                        include: [
                            {
                                model: User,
                                as: 'user',
                            }, {
                                model: Store,
                                as: 'store'
                            }, {
                                model: Employee,
                                as: 'deliMan'
                            }
                        ]
                    })
                    .then(order => {
                        if (!order) {
                            req.flash('errors', {msg: "Order not found!"});
                            res.redirect('back');
                        }
                        order
                            .update(req.body)
                            .then(() => {
                                req.flash('success', statusObj.msg);
                                if (req.body.status == 'Confirmed' && (req.body.deliMan_id != undefined && req.body.deliMan_id !== null && req.body.deliMan_id != "")) {
                                    Notification
                                        .create({
                                            order_id: order.id,
                                            title: "Order is assigned",
                                            body: "<i style='color: lawngreen;'>[Assign]</i> You has been assigned to a new order! Please confirm immediately!",
                                            user_id: order.deliMan_id,
                                            image_url: order.store.image_url
                                        })
                                        .then(notification => {
                                            console.log("create assigned notification successfully");
                                            // Send notification
                                            let notiContent = {
                                                notification: {
                                                    title: "New order waiting for Assignment Confirmation",
                                                    body: "A new order is assigned to you. Please response immediately!"
                                                }
                                            };
                                            FirebaseService
                                                .pushNotification(notiContent, false)
                                                .then(result => {
                                                    console.log("----");
                                                    console.log(result);
                                                    req.flash('success', statusObj.msg + " - Send notification successfully");
                                                })
                                                .catch(err => {
                                                    req.flash('errors', {msg: err.message});
                                                    res.redirect('back');
                                                })
                                        })
                                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                                }
                                if (req.body.status == 'Cancelled') {
                                    Notification
                                        .create({
                                            order_id: req.params.orderId,
                                            title: "Order is 'Cancelled'",
                                            body: "<i style='color:red'>[Cancelled]</i> Your order is cancelled by 'Delivery Fast' at <b>" + order.store.name + "</b>. Thank you for using our service!",
                                            image_url: order.store.image_url,
                                            user_id: order.user_id
                                        })
                                        .then(notification => {
                                            console.log("----");
                                            console.log("create Cancelled notification successfully");
                                        })
                                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                                }
                                if (req.body.status == 'Processing' || (req.body.status == 'Confirmed' && (req.body.deliMan_id == "" || req.body.deliMan_id == null) ))
                                    res.redirect(statusObj.url + req.params.orderId);
                                else res.redirect(statusObj.url);
                            })
                            .catch(err => {
                                req.flash('errors', {msg: err.message});
                                res.redirect('back');
                            })
                    })
                    .catch(err => {
                        req.flash('errors', {msg: err.message});
                        res.redirect('back');
                    })
            }
            else {
                req.flash('errors', {msg: 'Order status is invalid'});
                res.redirect('back');
            }

        }
        else {
            req.flash('errors', {msg: 'Order status must be contain to update!'});
            res.redirect('back');
        }
    },

    getSubmitted(req, res) {
        Order
            .findById(req.params.orderId, {
                where: {status: "Processing"},
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetails'
                    }, {
                        model: User,
                        as: 'user',
                    }, {
                        model: Store,
                        as: 'store'
                    }
                ]
            })
            .then(order => {
                if (!order) {
                    req.flash('errors', {msg: "Order not found!"});
                    res.redirect('back');
                }
                res.render('orders/submittedDetail', {order: order});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    getProcessing(req, res) {
        Order
            .findById(req.params.orderId, {where: {status: "confirmed"}})
            .then(order => {
                if (!order) {
                    req.flash('errors', {msg: "Order not found!"});
                    res.redirect('back');
                }
                res.render('orders/confirmedDetail', {orderId: req.params.orderId});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    get(req, res) {
        Order
            .findById(req.params.orderId, associationObject)
            .then(order => {
                if (!order) {
                    req.flash('errors', {msg: "Order not found!"});
                    res.redirect('back');
                }
                res.render('orders/orderDetail', {order: order});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    list(req, res) {
        Order
            .all({
                order: [['updatedAt', 'DESC']],
            })
            .then(orders => {
                res.render('orders/orderIndex', {orders: orders});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('/orders/submitted');
            })
    },

    getHistoryJSON(req, res) {
        Order
            .all({
                where: {
                    status: {$in: ["Cancelled", "Picked", "Assigned", "Delivered"]},
                    employee_id: req.session.user.id
                },
                include: [
                    {
                        model: Employee,
                        as: 'deliMan'
                    }
                ],
                order: [['updatedAt']]
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get order history successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    history(req, res) {
        res.render('orders/orderHistory');
    },

    statistics(req, res) {
        res.render('orders/statistics');
    },

    getStatisticsJSON(req, res) {
        let conditionWhere = {
            status: "Delivered",
            delivery_date: {$gt: new Date().setDate(new Date().getDate() - 30), $lt: new Date()}
        };
        if (req.query.startDate && req.query.endDate) {
            let startDate = new Date(req.query.startDate);
            let endDate = new Date(req.query.endDate);
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                endDate = endDate.setHours(23, 59, 59, 999);
                conditionWhere.delivery_date = {$gt: startDate, $lt: endDate}
            }
        }
        Order
            .all({
                where: conditionWhere,
                order: [['delivery_date', 'DESC']]
            })
            .then(orders => {
                console.log('here')
                return res.json(Response.returnSuccess("Get statistics successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    }
}