/**
 * Created by nathan on 17/10/2017.
 */
const Store = require('../../models/index').Store;
const StoreType = require('../../models/index').StoreType;
const StoreType_Store = require('../../models/index').StoreType_Store;
const Category = require('../../models/index').Category;
const multer = require('multer');
const path = require('path');
const validate = require('../../helpers/Validate');

module.exports = {
    get(req, res) {
        Store
            .findById(req.params.storeId,{
                include: [
                    {
                        model: StoreType,
                        as: 'storeTypes',
                        attributes: ['id','type'],
                        through: {
                            attributes: []
                        }
                    },
                    {
                        model: Category,
                        as: 'categories',
                    },
                ]
            })
            .then(store => {
                if (!store){
                    req.flash('errors', {msg: "Store not found"});
                    res.redirect('/stores');
                }
                StoreType
                    .all()
                    .then(storeTypes => {
                        return res.render("stores/detail", {store: store, storeTypes: storeTypes})
                    })
                    .catch(err => {
                        req.flash('errors', {msg: err.message})
                        res.redirect('back');
                    })
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    },

    list(req, res) {
        Store
            .all()
            .then(stores => {
                return res.render("stores/index", {stores: stores})
            })
            .catch(err => res.json(err))
    },

    create(req, res) {
        let storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, '../../publics/uploads/'));
            },
            filename: function (req, file, callback) {
                callback(null, req.body.name.replace(/\s/g, '') + '-' + Date.now() + path.extname(file.originalname))
            }
        });
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, callback) {
                if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true)
            }
        }).single('image_url');
        upload(req, res, function (err) {
            if (err) {   //Display errors to user
                req.flash('errors', {msg: err.message});
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
                if (errors) {   //Display errors to user
                    req.flash('errors', errors);
                    res.redirect('/stores/create');
                    return;
                }

                let store = Store.build(req.body);
                if (req.file != undefined)
                    store.image_url = '/uploads/' + req.file.filename;
                store
                    .save()
                    .then(savedstore => {
                        if (req.body.store_type!=undefined){
                            if(Array.isArray(req.body.store_type) == false){
                                req.body.store_type = [req.body.store_type];
                            }
                            req.body.store_type.forEach(function (storeType) {
                                StoreType_Store
                                    .create({store_id: savedstore.id, store_type_id: storeType})
                                    .then()
                                    .catch(err => {
                                        req.flash('errors', {msg: err.message});
                                        res.redirect('back');
                                    })
                            })
                        }
                    })
                    .then(() => {
                        req.flash('success', 'Create store successfully!')
                        res.redirect('/stores');
                    })
                    .catch(err => {
                        req.flash('errors', {msg: err.message});
                        res.redirect('back');
                    })
            }
        })
    },

    update(req, res) {
        console.log(__dirname);
        let storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, path.join(__dirname, '../../publics/uploads/'))
            },
            filename: function (req, file, callback) {
                callback(null, req.body.name.replace(/\s/g, '') + '-' + Date.now() + path.extname(file.originalname))
            }
        });
        var upload = multer({
            storage: storage,
            fileFilter: function (req, file, callback) {
                if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true)
            }
        }).single('image_url');
        upload(req, res, function (err) {
            if (err) {   //Display errors to user
                req.flash('errors', {msg: err.message});
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
                if (errors) {   //Display errors to user
                    req.flash('errors', errors);
                    res.redirect('/stores/create');
                    return;
                }
                Store
                    .findById(req.params.storeId)
                    .then(store => {
                        if(!store){
                            req.flash('errors', {msg: "Store not found"});
                            res.redirect('back');
                        }
                        if (req.file != undefined){
                            req.body.image_url = '/uploads/' + req.file.filename;
                        }
                        store
                            .update(req.body)
                            .then(savedStore => {
                                StoreType_Store
                                    .destroy({
                                        where: {
                                            store_id: savedStore.id
                                        }
                                    })
                                    .then(() => {
                                        if (req.body.store_type!=undefined){
                                            if(Array.isArray(req.body.store_type) == false){
                                                req.body.store_type = [req.body.store_type];
                                            }
                                            req.body.store_type.forEach(function (storeType) {
                                                StoreType_Store
                                                    .create({store_id: savedStore.id, store_type_id: storeType})
                                                    .then()
                                                    .catch(err => {
                                                        console.log(err);
                                                        req.flash('errors', {msg: err.message})
                                                        res.redirect('back');
                                                    })
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        req.flash('errors', {msg: err.message})
                                        res.redirect('back');
                                  4000  })

                            })
                            .then(() => {
                                req.flash('success', 'Update store successfully!')
                                res.redirect('back');
                            })
                            .catch(err => {
                                // console.log(err);
                                req.flash('errors', {msg: err.message})
                                res.redirect('back');
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        req.flash('errors', {msg: err.message})
                        res.redirect('back');
                    })
            }
        })
    },

    add(req, res) {
        StoreType
            .all()
            .then(storeTypes => {
                return res.render('stores/create', {storeTypes: storeTypes});
            })
            .catch(err => {
                req.flash('errors', {msg: err.message})
                res.redirect('back');
            })
    }
}