/**
 * Created by nathan on 11/10/2017.
 */
const UserPhone = require('../models').UserPhone;
const config = require('../config');

module.exports = {
    list(req, res) {
        let user = req.user;
        UserPhone
            .find({
                where: {
                    user_id: user.id
                }
            })
            .then(phones => {
                return res.json({
                    status: true,
                    message: `Get phone numbers of ${user.username}`,
                    data: {
                        phones: phones
                    }
                })
            })
            .catch(error => {
                res.status(400).send(error)
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
                console.log(req.user.id);
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
                                .then(phoneSaved => res.status(200).json({
                                    status: true,
                                    message: 'Add new phone number successfully!',
                                    data: {
                                        phone: phoneSaved
                                    }
                                }))
                                .catch(err => res.status(400).json(err))

                        })
                        .catch(err => res.status(400).json(err))
                }
                else return res.status(400).json({
                    status: false,
                    message: 'This phone number has been existed'})
            })
            .catch(error => res.status(400).send(error))
    },

    setPrimary(req, res) {
        UserPhone
            .find({user_id: req.user.id, role: true})
            .then(phone => {
                if (phone)
                    phone
                        .update({role: false})
                        .then()
                        .catch(err => res.status(400).json(err));
                UserPhone
                    .findById(req.params.phoneId)
                    .then(userPhone => {
                        if (!userPhone)
                            return res.status(404).json({message: 'Phone number not found!'});
                        userPhone
                            .update({role: true})
                            .then(phoneSaved => res.status(200).json(phoneSaved))
                            .catch(err => res.status(400).json(err))

                    })
                    .catch(err => res.status(400).json(err))
            })

            .catch(err => res.status(400).json(err));

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
                    return res.json({
                        status: false,
                        message: 'Phone Not Found',
                    });
                }
                if (phone.role == true) {
                    return res.json({
                        status: false,
                        message: 'Primary Phone cannot be deleted!',
                    });
                }
                return phone
                    .destroy()
                    .then(() => res.json({
                        status: true,
                        message: 'Delete phone number successfully'
                    }))
                    .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
    },
}