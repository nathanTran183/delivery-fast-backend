'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var users = require('./users');
var employees = require('./employees');
var stores = require('./stores');
var storetypes = require('./storetypes');
var categories = require('./categories');
var addons = require('./addons');
var products = require('./products');
var productaddons = require('./productaddons');
var discounts = require('./discounts');
var orders = require('./orders');
module.exports = {
    users: users,
    employees: employees,
    stores: stores,
    storetypes: storetypes,
    categories: categories,
    addons: addons,
    products: products,
    productaddons: productaddons,
    discounts: discounts,
    orders: orders
};