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
    update: function update(req, res) {
        Order.findById(req.params.orderId).then(function (order) {
            if (!order) {
                return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND));
            }
            order.update(req.body).then(function (savedOrder) {
                return res.json(Response.returnSuccess("Update order's status successfully!", { order: savedOrder }));
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    },
    getSubmittedList: function getSubmittedList(req, res) {
        Order.all({
            where: {
                status: 'Order Submitted'
            }
        }).then(function (orders) {
            res.render('orders/submittedIndex', { orders: orders });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('/orders/submitted');
        });
    },
    history: function history(req, res) {
        Order.all({
            where: {
                status: { $ne: "Pending" },
                user_id: req.user.id
            }
        }).then(function (orders) {
            return res.json(Response.returnSuccess("Get order history successfully!", { orders: orders }));
        }).catch(function (err) {
            return res.json(Response.returnError(err.message, err.code));
        });
    }
};