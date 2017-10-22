/**
 * Created by nathan on 11/10/2017.
 */
const UserPhone = require('../../models/index').UserPhone;
const httpStatus = require('http-status');
const Response = require('../../helpers/response');
const config = require('../../config/index');

module.exports = {
    list(req, res) {
        let user = req.user;
        UserPhone
            .all({
                where: {
                    user_id: user.id
                }
            })
            .then(phones => {
                console.log(phones)
                return res.json(Response.returnSuccess(`Get phone numbers of user`, {phones: phones}))
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code))
            })
    },

    add(req, res) {
        UserPhone
            .find({
                where: {
                    phone_number: req.body.phone_number
                }
            })
            .then(phones => {
                if (!phones) {
                    UserPhone
                        .find({
                            where: {
                                user_id: req.user.id
                            }
                        })
                        .then(userPhones => {
                            let userPhone = UserPhone.build({
                                phone_number: req.body.phone_number,
                                user_id: req.user.id
                            });
                            if (!userPhones) {
                                userPhone.role = true;
                            }
                            else userPhone.role = false;
                            userPhone
                                .save()
                                .then(phoneSaved => res.status(200).json(Response.returnSuccess('Add new phone number successfully!', {phone: phoneSaved})))
                                .catch(err => res.json(Response.returnError(err.message, err.code)))

                        })
                        .catch(err => res.json(Response.returnError(err.message, err.code)))
                }
                else return res.json(Response.returnError('This phone number has been existed', httpStatus.BAD_REQUEST))
            })
            .catch(error => res.json(Response.returnError(error.message, error.code)))
    },

    setPrimary(req, res) {
        UserPhone
            .find({user_id: req.user.id, role: true})
            .then(phone => {
                if (phone)
                    phone
                        .update({role: false})
                        .then()
                        .catch(err => res.json(Response.returnError(err.message, err.code)));
                UserPhone
                    .findById(req.params.phoneId)
                    .then(userPhone => {
                        if (!userPhone)
                            return res.json(Response.returnError('Phone number not found!', httpStatus.NOT_FOUND));
                        userPhone
                            .update({role: true})
                            .then(phoneSaved => res.json(Response.returnSuccess("Set phone number becoming Primary successfully!", {phone: phoneSaved})))
                            .catch(err => res.json(Response.returnError(err.message, err.code)))

                    })
                    .catch(err => res.json(Response.returnError(err.message, err.code)))
            })

            .catch(err => res.json(Response.returnError(err.message, err.code)));

    },

    delete(req, res) {
        UserPhone
            .find({
                where: {
                    id: req.params.phoneId,
                    user_id: req.user.id
                },
            })
            .then(phone => {
                if (!phone) {
                    return res.json(Response.returnError('Phone Not Found', httpStatus.NOT_FOUND));
                }
                if (phone.role == true) {
                    return res.json(Response.returnError('Primary Phone cannot be deleted!', httpStatus.BAD_REQUEST));
                }
                return phone
                    .destroy()
                    .then(() => res.json(Response.returnSuccess('Delete phone number successfully', {})))
                    .catch(error => res.json(Response.returnError(error.message,error.code)));
            })
            .catch(error => res.json(Response.returnError(error.message,error.code)));
    },
}