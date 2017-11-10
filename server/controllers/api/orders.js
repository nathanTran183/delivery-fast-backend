/**
 * Created by nathan on 08/11/2017.
 */
const Response = require('../../helpers/response');
const httpStatus = require('http-status');
const Order = require('../../models/index').Order;
const OrderDetail = require('../../models/index').OrderDetail;

module.exports = {
    get(req, res) {
        Order
            .findById(req.params.orderId)
            .then(order => {
                if (!order) {
                    Order
                        .create({order_date: Date.now(), user_id: req.user.id, store_id: req.params.storeId})
                        .then(savedOrder => {
                            return res.json(Response.returnSuccess("Get pending order successfully!", {order: savedOrder}))
                        })
                        .catch(err => Response.returnError(err.message, err.code))
                }
                return res.json(Response.returnSuccess("Get pending order successfully!", {order: order}));
            })
            .catch(err => Response.returnError(err.message, err.code))
    },

    /*getPending(req, res) {
        if(req.user){
            Order
                .find({
                    where: {
                        user_id: req.user.id,
                        status: 'Pending'
                    }
                })
                .then(order => {
                    if (!order) {
                        // this.create(req,res);
                        Order
                            .create({order_date: Date.now(), user_id: req.user.id, store_id: req.params.storeId})
                            .then(savedOrder => {
                                return res.json(Response.returnSuccess("Get pending order successfully!", {order: savedOrder}))
                            })
                            .catch(err => Response.returnError(err.message, err.code))
                    }
                    return res.json(Response.returnSuccess("Get pending order successfully!", {order: order}));
                })
                .catch(err => Response.returnError(err.message, err.code))
        }

    },*/

    list(req, res) {
        Order
            .all({
                include: [
                    {
                        model: OrderDetail,
                        as: 'orderDetails'
                    }
                ]
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get list order successfully", {orders: orders}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    create(req, res) {
        req.body.user_id = req.user.id;
        console.log(req.body);
        Order
            .create(req.body)
            .then(order => {
                if(req.body.orderDetails && req.body.orderDetails.length > 0){
                    req.body.orderDetails.forEach(orderDetail => {
                        orderDetail.order_id = order.id;
                        OrderDetail
                            .create(orderDetail)
                            .then(() => {
                            })
                            .catch(err => res.json(Response.returnError(err.message, err.code)))
                    })
                }
                return res.json(Response.returnSuccess("Create order successfully!", {order: order}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    update(req, res) {
        Order
            .findById(req.params.orderId)
            .then(order => {
                if (!order) {
                    return res.json(Response.returnError("Order not found!", httpStatus.NOT_FOUND))
                }
                order
                    .update(req.body)
                    .then(savedOrder => {
                        return res.json(Response.returnSuccess("Update order successfully!", {order: savedOrder}))
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)));
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
            .catch(err => res.json(Response.returnError(err.message,err.code)))
    },

    history(req, res) {
        Order
            .all({
                where: {
                    status: {$or: ["Cancelled", "Delivered"]},
                    user_id: req.user.id
                }
            })
            .then(orders => {
                return res.json(Response.returnSuccess("Get submmited order list successfully!", {orders: orders}));
            })
            .catch(err => res.json(Response.returnError(err.message,err.code)))
    }
}