/**
 * Created by nathan on 11/10/2017.
 */
const UserPhone = require('../models').UserPhone;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config');

module.exports = {
    list(req, res) {
        UserPhone
            .all()
    },

    add(req, res) {
        //check number existed

        //check role to set role
    },

    update(req, res) {
        //check number existed
    },

    delete(req, res) {

    },
}