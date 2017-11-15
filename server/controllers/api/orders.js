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
    },], attributes: {
        exclude: ['user_id', 'store_id', 'employee_id', 'deliMan_id']
    }
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
        Order
            .findById(req.params.orderId)
            .then(order => {
                if (!order) {
                    return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND))
                }
                order
                    .update({status: req.body.status})
                    .then(savedOrder => {
                        return res.json(Response.returnSuccess("Update order's status successfully!", {order: savedOrder}));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))

            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    getSubmittedList(req, res){
        Order
            .all({
                where: {
                    status: 'Order Submitted',
                }
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get submmited order list successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    history(req, res) {
        Order
            .all({
                where: {
                    status: {$in: ["Cancelled", "Delivered"]},
                    user_id: req.user.id
                },
                attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                include: [{
                    model: Store,
                    as: 'store',
                    attributes: ['name', 'address']
                }]
            })
            .then(orders => {
                Order
                    .all({
                        where: {
                            status: {$notIn: ["Delivered", "Cancelled"]},
                            user_id: req.user.id
                        },
                        attributes: ['id', 'status', 'order_date', 'delivery_date', 'total_amount'],
                        include: [{
                            model: Store,
                            as: 'store',
                            attributes: ['name', 'address']
                        }]
                    })
                    .then(inComing => {
                        return res.json(Response.returnSuccess("Get order history successfully!", {history: orders, inComing: inComing}));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },
}