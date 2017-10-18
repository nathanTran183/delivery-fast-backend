/**
 * Created by nathan on 11/10/2017.
 */
const UserAddress = require('../models').UserAddress;
const httpStatus = require('http-status');
const config = require('../config');
const Response = require('../helpers/response');
module.exports = {
    list(req, res) {
        let user = req.user;
        UserAddress
            .find({
                where: {
                    user_id: user.id
                }
            })
            .then(address => {
                let data= {
                    address: address
                };
                return res.json(Response.returnSuccess("Get list address successfully!", data))
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code));
            })
    },

    add(req, res) {
        let address = UserAddress.build(req.body);
        address.user_id = req.user.id
        address
            .save()
            .then(address => {
                let data = {
                    address: address
                };
                res.json(Response.returnSuccess("Create address successfully", data));
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
    },

    delete(req, res) {
        UserAddress
            .findById(req.params.addressId)
            .then(address => {
                if (!address) {
                    return res.json(Response.returnError('Address Not Found',httpStatus.NOT_FOUND));
                }
                return address
                    .destroy()
                    .then(() => res.json(Response.returnSuccess('Delete address successfully', {})))
                    .catch(error => res.json(Response.returnError(error.message, error.code)));
            })
            .catch(error => res.json(Response.returnError(error.message, error.code)));
    }
}