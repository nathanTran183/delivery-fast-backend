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
            .all({
                order: '"updatedAt"'
            })
            .then(orders => {
                res.render('orders/submittedIndex', {orders: orders});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('/orders/submitted');
            })
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
                },
                order: '"updatedAt"'
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