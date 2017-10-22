/**
 * Created by nathan on 05/10/2017.
 */
const User = require('../../models/index').User;
const UserPhone = require('../../models/index').UserPhone;
const UserAddress = require('../../models/index').UserAddress;
const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const Response = require('../../helpers/response');
const config = require('../../config/index');

module.exports = {

    list(req, res) {
        return User
            .all({
                include: [
                    {
                        model: UserPhone,
                        as: 'userPhones',
                    },
                    {
                        model: UserAddress,
                        as: 'userAddress',
                    }
                ],
                offset: req.query.offset || 0,
                limit: req.query.limit || 10
            })
            .then(users => res.json(Response.returnSuccess("Get list of users successfully", {users: users})))
            .catch(error => {
                res.send(Response.returnError(error.message, error.code))
            });
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
                    return res.json(Response.returnError('User Not Found', httpStatus.NOT_FOUND));
                }
                return res.status(200).json(Response.returnSuccess("Retrieve user successfully!", user));
            })
            .catch(error => res.send(Response.returnError(error.message, error.code)));
    },

    update(req, res) {
        return User
            .findById(req.params.userId)
            .then(user => {
                if (!user) {
                    return res.json(Response.returnError('User Not Found', httpStatus.NOT_FOUND));
                }
                user
                    .update({status: req.body.status})
                    .then(savedUser => {
                        return res.json(Response.returnSuccess("Update user successfully!", {user: savedUser}));
                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })
            .catch(error => res.send(Response.returnError(error.message, error.code)));
    },


};