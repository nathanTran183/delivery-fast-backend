'use strict';

/**
 * Created by nathan on 05/10/2017.
 */
var User = require('../../models/index').User;
var UserPhone = require('../../models/index').UserPhone;
var UserAddress = require('../../models/index').UserAddress;
var jwt = require('jsonwebtoken');
var httpStatus = require('http-status');
var Response = require('../../helpers/Response');
var config = require('../../config/index');

module.exports = {
    list: function list(req, res) {
        User.all().then(function (users) {
            return res.render('user/index', { users: users });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    blackList: function blackList(req, res) {
        User.all({
            where: { status: false }
        }).then(function (users) {
            return res.render('user/blackList', { users: users });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    get: function get(req, res) {
        return User.findById(req.params.userId, {
            include: [{
                model: UserPhone,
                as: 'userPhones'
            }, {
                model: UserAddress,
                as: 'userAddress'
            }]
        }).then(function (user) {
            if (!user) {
                req.flash('reason-fail', 'User not found!');
                res.redirect('back');
            }
            return res.render('user/detail', { user: user });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    update: function update(req, res) {
        return User.findById(req.params.userId).then(function (user) {
            if (!user) {
                req.flash('reason-fail', 'User not found!');
                res.redirect('back');
            }
            user.status = user.status == true ? false : true;
            user.save().then(function (savedUser) {
                req.flash('success', 'User status has been change!');
                res.redirect('back');
            }).catch(function (err) {
                return res.json(Response.returnError(err.message, err.code));
            });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    }
};