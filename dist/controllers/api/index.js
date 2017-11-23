'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var users = require('./users');
var userphones = require('./userphones');
var useraddress = require('./useraddress');
var employees = require('./employees');
var stores = require('./stores');
var orders = require('./orders');
var discounts = require('./discounts');
var socket = require('./socket');

module.exports = {
    users: users,
    userphones: userphones,
    useraddress: useraddress,
    employees: employees,
    stores: stores,
    orders: orders,
    discounts: discounts,
    socket: socket
};