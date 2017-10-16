/**
 * Created by nathan on 11/10/2017.
 */
const UserAddress = require('../models').UserAddress;
const httpStatus = require('http-status');
const config = require('../config');

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
                return res.json({
                    status: true,
                    data: {
                        address: address
                    }
                })
            })
            .catch(error => {
                res.status(400).send(error)
            })
    },

    add(req, res) {
        let address = UserAddress.build(req.body);
        address.user_id = req.user.id
        address
            .save()
            .then(address => res.json({
                status: true,
                data: {
                    address: address
                }
            }))
            .catch(err => res.status(400).json(err))
    },

    delete(req, res) {
        UserAddress
            .findById(req.params.addressId)
            .then(address => {
                if (!address) {
                    return res.json({
                        status: false,
                        message: 'Address Not Found',
                    });
                }
                return address
                    .destroy()
                    .then(() => res.json({
                        status: true,
                        message: 'Delete address successfully'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    }
}