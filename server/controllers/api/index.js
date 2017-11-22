/**
 * Created by nathan on 05/10/2017.
 */
const users = require('./users');
const userphones = require('./userphones');
const useraddress = require('./useraddress');
const employees = require('./employees');
const stores = require('./stores');
const orders = require('./orders');
const discounts = require('./discounts');
const socket = require('./socket');

module.exports = {
    users,
    userphones,
    useraddress,
    employees,
    stores,
    orders,
    discounts,
    socket
};