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

var associationObject = {
    include: [{
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
    },]
};

module.exports = {
    get(req, res) {
        Order
            .findById(req.params.orderId, associationObject)
            .then(order => {
                if (!order) {
                    return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND))
                }
                return res.json(Response.returnSuccess("Get order successfully!", {order: order}));
            })
            .catch(err => Response.returnError(err.message, err.code))
    },

    list(req, res) {
        Order
            .all(associationObject)
            .then(orders => {
                return res.json(Response.returnSuccess("Get list order successfully", {orders: orders}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    updateClient(req, res) {
        Order
            .findById(req.params.orderId)
            .then(order => {
                if (!order) {
                    return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND))
                }
                order
                    .update(req.body)
                    .then(savedOrder => {
                        OrderDetail
                            .destroy({
                                where: {
                                    order_id: savedOrder.id
                                }
                            })
                            .then(() => {
                                if (req.body.orderDetails && req.body.orderDetails.length > 0) {
                                    OrderDetail
                                        .bulkCreate(req.body.orderDetails)
                                        .then((orderDetails) => {
                                            if (savedOrder.status == "Order Submitted") {
                                                emitter.emit('reloadSubmittedOrder', {msg: 'Reload submitted order'});
                                            }
                                            return res.json(Response.returnSuccess("Update order successfully!", {
                                                order: savedOrder,
                                                orderDetails: orderDetails
                                            }))
                                        })
                                        .catch(err => res.json(Response.returnError(err.message, err.code)));
                                }
                                else return res.json(Response.returnSuccess("Update order successfully!", {
                                    order: savedOrder,
                                    orderDetails: null
                                }))
                            })
                            .catch(err => res.json(Response.returnError(err.message, err.code)));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    updateStatus(req, res) {
        let message = "";
        Order
            .findById(req.params.orderId,
                {
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
                    return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND))
                }
                if (req.body.status == "Cancelled" || req.body.status == "Delivered")
                    req.body.delivery_date = new Date();
                if (req.body.deliMan_id == "")
                    req.body.deliMan_id = null;
                order
                    .update(req.body)
                    .then(savedOrder => {
                        if (savedOrder.status == "Confirmed" && savedOrder.deliMan_id == null) {
                            emitter.emit('reloadPendingOrder', {
                                msg: 'DeliMan ' + req.body.deliMan.last_name + " " + req.body.deliMan.first_name
                                + ' cancelled the assignment of order ' + savedOrder.id + '! Please assign another deliman'
                            });
                        }
                        if (savedOrder.status == "Delivered") {
                            Notification
                                .create({
                                    order_id: order.id,
                                    title: "Order is completed",
                                    body: "<i style='color: lawngreen'>[Completed]</i>" + order.deliMan.first_name + " "
                                    + order.deliMan.last_name + " has delivered your order at <b>" + order.store.name + "</b>. Thank you for using our service!",
                                    user_id: order.user_id,
                                    image_url: order.store.image_url
                                })
                                .then(notification => {
                                    message+= "Create delivered notification successfully! ";
                                })
                                .catch(err => res.json(Response.returnError(err.message, err.code)))
                        }
                        if(savedOrder.status == "Assigned" || savedOrder.status == "Picked" || savedOrder.status == "Delivered"){
                            emitter.emit('reloadHistoryOrder', {msg: 'Reload history orders'});
                        }
                        return res.json(Response.returnSuccess("Update order's status successfully! " + message, {order: savedOrder}));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    history(req, res) {
        let historyWhere = {
            status: {$in: ["Cancelled", "Delivered"]},
            user_id: req.user.id,
        };
        let inComingWhere = {
            status: {$notIn: ["Delivered", "Cancelled", "Pending"]},
            user_id: req.user.id
        };
        if (req.query.startDate && req.query.endDate) {
            req.query.endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
            historyWhere.delivery_date = {$gt: req.query.startDate, $lt: req.query.endDate};
            inComingWhere.delivery_date = {$gt: req.query.startDate, $lt: req.query.endDate};
        }
        Order
            .all({
                where: historyWhere,
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            })
            .then(orders => {
                Order
                    .all({
                        where: inComingWhere,
                        attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                        order: [['updatedAt', 'DESC']],
                        include: [{
                            model: Store,
                            as: 'store',
                            attributes: ['name', 'address']
                        }]
                    })
                    .then(inComing => {
                        return res.json(Response.returnSuccess("Get order history successfully!", {
                            history: orders,
                            inComing: inComing
                        }));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    getOrderList(req, res) {
        let historyWhere = {
            status: {$in: ["Cancelled", "Delivered"]},
            deliMan_id: req.user.id,
        };
        let inComingWhere = {
            status: {$notIn: ["Delivered", "Cancelled", "Pending"]},
            deliMan_id: req.user.id
        };
        if (req.query.startDate && req.query.endDate) {
            req.query.endDate = new Date(req.query.endDate).setHours(23, 59, 59, 999);
            historyWhere.delivery_date = {$gt: req.query.startDate, $lt: req.query.endDate};
            inComingWhere.delivery_date = {$gt: req.query.startDate, $lt: req.query.endDate};
        }
        Order
            .all({
                where: historyWhere,
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                order: [['updatedAt', 'DESC']],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            })
            .then(orders => {
                Order
                    .all({
                        where: inComingWhere,
                        attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                        order: [['updatedAt', 'DESC']],
                        include: [{
                            model: Store,
                            as: 'store',
                            attributes: ['name', 'address']
                        }]
                    })
                    .then(inComing => {
                        return res.json(Response.returnSuccess("Get order history successfully!", {
                            history: orders,
                            inComing: inComing
                        }));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    }
}