'use strict';

/**
 * Created by nathan on 17/10/2017.
 */
var Store = require('../../models/index').Store;
var StoreType = require('../../models/index').StoreType;
var StoreType_Store = require('../../models/index').StoreType_Store;
var Category = require('../../models/index').Category;
var multer = require('multer');
var path = require('path');
var validate = require('../../helpers/validate');

module.exports = {
    get: function get(req, res) {
        Store.findById(req.params.storeId, {
            include: [{
                model: StoreType,
                as: 'storeTypes',
                attributes: ['id', 'type'],
                through: {
                    attributes: []
                }
            }, {
                model: Category,
                as: 'categories'
            }]
        }).then(function (store) {
            if (!store) {
                req.flash('errors', { msg: "Store not found" });
                res.redirect('/stores');
            }
            StoreType.all().then(function (storeTypes) {
                return res.render("stores/detail", { store: store, storeTypes: storeTypes });
            }).catch(function (err) {
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    },
    list: function list(req, res) {
        Store.all().then(function (stores) {
            return res.render("stores/index", { stores: stores });
        }).catch(function (err) {
            return res.json(err);
        });
    },
    create: function create(req, res) {
        var storage = multer.diskStorage({
            destination: function destination(req, file, callback) {
                callback(null, 'server/publics/uploads');
            },
            filename: function filename(req, file, callback) {
                callback(null, req.body.name.replace(/\s/g, '') + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        var upload = multer({
            storage: storage,
            fileFilter: function fileFilter(req, file, callback) {
                if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            }
        }).single('image_url');
        upload(req, res, function (err) {
            if (err) {
                //Display errors to user
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            } else {
                req.assert('name', 'Store name is required!').notEmpty();
                req.assert('address', 'Store address is required!').notEmpty();
                req.assert('phone_number', 'Phone number is required').notEmpty();
                req.assert('opening_time', 'Opening time is required').notEmpty();
                req.assert('closing_time', 'Closing time is required').notEmpty();
                var errors = req.validationErrors();
                if (validate.isPhoneNumber(req.body.phone_number) == false) {
                    errors = validate.addErrorAssert("Phone number must be phone format!", errors);
                }
                if (errors) {
                    //Display errors to user
                    req.flash('errors', errors);
                    res.redirect('/stores/create');
                    return;
                }

                var store = Store.build(req.body);
                if (req.file != undefined) store.image_url = '/uploads/' + req.file.filename;
                store.save().then(function (savedstore) {
                    if (req.body.store_type != undefined) {
                        if (Array.isArray(req.body.store_type) == false) {
                            req.body.store_type = [req.body.store_type];
                        }
                        req.body.store_type.forEach(function (storeType) {
                            StoreType_Store.create({ store_id: savedstore.id, store_type_id: storeType }).then().catch(function (err) {
                                req.flash('errors', { msg: err.message });
                                res.redirect('back');
                            });
                        });
                    }
                }).then(function () {
                    req.flash('success', 'Create store successfully!');
                    res.redirect('/stores');
                }).catch(function (err) {
                    req.flash('errors', { msg: err.message });
                    res.redirect('back');
                });
            }
        });
    },
    update: function update(req, res) {
        var storage = multer.diskStorage({
            destination: function destination(req, file, callback) {
                callback(null, 'server/publics/uploads');
            },
            filename: function filename(req, file, callback) {
                callback(null, req.body.name.replace(/\s/g, '') + '-' + Date.now() + path.extname(file.originalname));
            }
        });
        var upload = multer({
            storage: storage,
            fileFilter: function fileFilter(req, file, callback) {
                if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true);
            }
        }).single('image_url');
        upload(req, res, function (err) {
            if (err) {
                //Display errors to user
                req.flash('errors', { msg: err.message });
                res.redirect('back');
            } else {
                req.assert('name', 'Store name is required!').notEmpty();
                req.assert('address', 'Store address is required!').notEmpty();
                req.assert('phone_number', 'Phone number is required').notEmpty();
                req.assert('opening_time', 'Opening time is required').notEmpty();
                req.assert('closing_time', 'Closing time is required').notEmpty();
                req.assert('longitude', 'Longitude is required').notEmpty();
                req.assert('latitude', 'Latitude is required').notEmpty();

                var errors = req.validationErrors();
                if (validate.isPhoneNumber(req.body.phone_number) == false) {
                    errors = validate.addErrorAssert("Phone number must be phone format!", errors);
                }
                if (errors) {
                    //Display errors to user
                    req.flash('errors', errors);
                    res.redirect('/stores/create');
                    return;
                }
                Store.findById(req.params.storeId).then(function (store) {
                    if (!store) {
                        req.flash('errors', { msg: "Store not found" });
                        res.redirect('back');
                    }
                    if (req.file != undefined) {
                        req.body.image_url = '/uploads/' + req.file.filename;
                    }
                    store.update(req.body).then(function (savedStore) {
                        StoreType_Store.destroy({
                            where: {
                                store_id: savedStore.id
                            }
                        }).then(function () {
                            if (req.body.store_type != undefined) {
                                if (Array.isArray(req.body.store_type) == false) {
                                    req.body.store_type = [req.body.store_type];
                                }
                                req.body.store_type.forEach(function (storeType) {
                                    StoreType_Store.create({ store_id: savedStore.id, store_type_id: storeType }).then().catch(function (err) {
                                        console.log(err);
                                        req.flash('errors', { msg: err.message });
                                        res.redirect('back');
                                    });
                                });
                            }
                        }).catch(function (err) {
                            console.log(err);
                            req.flash('errors', { msg: err.message });
                            res.redirect('back');
                            4000;
                        });
                    }).then(function () {
                        req.flash('success', 'Update store successfully!');
                        res.redirect('back');
                    }).catch(function (err) {
                        // console.log(err);
                        req.flash('errors', { msg: err.message });
                        res.redirect('back');
                    });
                }).catch(function (err) {
                    console.log(err);
                    req.flash('errors', { msg: err.message });
                    res.redirect('back');
                });
            }
        });
    },
    add: function add(req, res) {
        StoreType.all().then(function (storeTypes) {
            return res.render('stores/create', { storeTypes: storeTypes });
        }).catch(function (err) {
            req.flash('errors', { msg: err.message });
            res.redirect('back');
        });
    }
};