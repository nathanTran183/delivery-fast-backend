/**
 * Created by nathan on 08/11/2017.
 */
const Response = require('../../helpers/response');
const httpStatus = require('http-status');
const Order = require('../../models/index').Order;
const OrderDetail = require('../../models/index').OrderDetail;
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const Employee = require('../../models/index').Employee;
const Store = require('../../models/index').Store;
const _ = require('lodash');
const orderStatus = require('../../helpers/orderStatus');

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
    ], attributes: {
        exclude: ['user_id', 'store_id', 'employee_id', 'deliMan_id']
    }
};

module.exports = {
    getSubmittedList(req, res){
        Order
            .all({
                where: {
                    status: 'Order Submitted',
                },
                order: [['updatedAt']]
            })
            .then(orders => {
                res.render('orders/submittedIndex', {orders: orders});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    },

    update(req, res) {
        if (req.body.status) {
            let statusObj = _.find(orderStatus, {latter: req.body.status});
            if (!statusObj) {
                Order
                    .findById(req.params.orderId, {
                        where: {status: statusObj.former}
                    })
                    .then(order => {
                        if (!order) {
                            req.flash('errors', {msg: "Order not found!"});
                            res.redirect('back');
                        }
                        order
                            .update(req.body)
                            .then(() => {
                                req.flash('success', {msg: "Order has been updated successfully!"});
                                res.redirect(statusObj.url);
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
            .findById(req.params.orderId, associationObject.where = {status: "Processing"})
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
            .findById(req.params.orderId, associationObject)
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

    get(req, res) {
        Order
            .findById(req.params.orderId,
                associationObject
            )
            .then(order => {
                if (!order) {
                    req.flash('errors', {msg: "Order not found!"});
                    res.redirect('back');
                }
            })
            .catch(err => Response.returnError(err.message, err.code))
    },

    list(req, res) {
        Order
            .all({
                order: [['updatedAt', 'DESC']]
            })
            .then(orders => {
                res.render('orders/submittedIndex', {orders: orders});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('/orders/submitted');
            })
    },


    history(req, res) {
        Order
            .all({
                where: {
                    status: {$ne: "Pending"},
                    user_id: req.user.id
                }
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get order history successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    }
}