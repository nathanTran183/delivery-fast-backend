/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Response = require('../../helpers/Response');
const config = require('../../config/index');

module.exports = {

    list(req, res) {
        User
            .all()
            .then(users => {
                return res.render('user/index', {users: users});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    },

    blackList(req, res) {
        User
            .all({
                where: {status: false}
            })
            .then(users => {
                return res.render('user/blackList', {users: users});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    },

    get(req, res) {
        return User
            .findById(req.params.userId, {
                include: [
                    {
                        model: UserPhone,
                        as: 'userPhones',
                    },
                    {
                        model: UserAddress,
                        as: 'userAddress',
                    }],
            })
            .then(user => {
                if (!user) {
                    req.flash('reason-fail', 'User not found!');
                    res.redirect('back');
                }
                return res.render('user/detail', {user: user});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    },

    update(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    req.flash('reason-fail', 'User not found!');
                    res.redirect('back');
                }
                user.status = user.status == true ? false : true;
                user
                    .save()
                    .then(savedUser => {
                        req.flash('success', 'User status has been change!');
                        res.redirect('back');
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    },


};