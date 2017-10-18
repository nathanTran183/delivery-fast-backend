const Response = require('../helpers/response');
const HTTPStatus = require('http-status');
const User = require('../models').User;
const Employee = require('../models').Employee;

module.exports = {
    async isAdmin(req, res, next) {
        if(req.user) {
            if (req.user.role === 'Admin') {
                next();
            } else {
                return res.json(Response.returnError("Only Admin can access this route!", HTTPStatus.UNAUTHORIZED));
            }
        }
        else return res.json(Response.returnError("Should login with Admin account!", HTTPStatus.UNAUTHORIZED))
    },

    async isUser(req, res, next) {
        if(req.user){
            User
                .findById(req.user.id)
                .then(user => {
                    if(!user) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                    if(user.status == false) return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                    if (req.user.role === 'User') {
                        next();
                    } else {
                        return res.json(Response.returnError("Only users can access the route!", HTTPStatus.UNAUTHORIZED));
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)))
        }
        else return res.json(Response.returnError("Should login with user account!", HTTPStatus.UNAUTHORIZED))
    },

    async notUser(req, res, next) {
        if(req.user) {
            Employee
                .findById(req.user.id)
                .then(employee => {
                    if(!employee) return res.json(Response.returnError('User not found!', HTTPStatus.NOT_FOUND));
                    if(employee.status == 'Deactivated') return res.json(Response.returnError('Your account has been deactivated!', HTTPStatus.UNAUTHORIZED));
                    if (req.user.role !== 'User') {
                        next();
                    } else {
                        return res.json(Response.returnError("Users cannot access the route!", HTTPStatus.UNAUTHORIZED));
                    }
                })
                .catch(err => res.json(Response.returnError(err.message, err.code)))
        } else return res.json(Response.returnError("Should login with not user account!", HTTPStatus.UNAUTHORIZED))
    }
};