/**
 * Created by nathan on 06/11/2017.
 */
const Category = require('../../models/index').Category;
const Product = require('../../models/index').Product;
const validate = require('../../helpers/Validate');
const multer = require('multer');
const path = require('path');
module.exports = {
    list(req, res) {
        Addon
            .all({
                where: {
                    store_id: req.params.storeId
                }
            })
            .then(categories => {

            })
            .catch(err => {

            })
    },

    get(req, res) {
        Category
            .findById(req.params.categoryId,{
                include: [
                    {

                    }
                ]
            })
            .then(category => {

            })
            .catch(err => {

            })
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
            }
            req.assert('name', 'Product name is required!').notEmpty();
            req.assert('price', 'Product price is required!').notEmpty();
            req.assert('price', 'Product price has been number only!').isNumeric();

            var errors = req.validationErrors();
            if (errors) {   //Display errors to user
                req.flash('errors', errors);
                res.redirect('back');
                return;
            }

            let product = Product.build(req.body);
            product.category_id = req.params.categoryId;
            if (req.file != undefined){
                product.image_url = '/uploads/' + req.file.filename;
            }
            product
                .save()
                .then(savedProduct => {
                    req.flash('success', 'Create product successfully!');
                    return res.redirect('back');
                })
                .catch(err => {
                    req.flash('errors', {msg: err.message});
                    res.redirect('back');
                })
        });
    },

    update(req, res){
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
            }

            req.assert('name', 'Product name is required!').notEmpty();
            req.assert('price', 'Product price is required!').notEmpty();
            req.assert('price', 'Product price has been number only!').isNumeric();
            var errors = req.validationErrors();
            if (errors) {   //Display errors to user
                req.flash('errors', errors);
                res.redirect('back');
                return;
            }

            Product
                .findById(req.params.productId)
                .then(product => {
                    if(!product) {
                        req.flash('errors', {msg: 'Product not found!'});
                        res.redirect('back');
                    }
                    if (req.file != undefined){
                        req.body.image_url = '/uploads/' + req.file.filename;
                    }
                    product
                        .update(req.body)
                        .then(savedProduct => {
                            req.flash('success', 'Update product successfully!');
                            return res.redirect('back');
                        })
                        .catch(err => {
                            req.flash('errors', {msg: err.message});
                            res.redirect('back');
                        })
                })
                .catch(err => {
                    req.flash('errors', {msg: err.message});
                    res.redirect('back');
                })
        });
    },

    delete(req, res){
        Product
            .findById(req.params.productId)
            .then(product => {
                if(!product) {
                    req.flash('errors', {msg: 'Product not found'});
                    res.redirect('back');
                }
                product
                    .destroy()
                    .then(()=> {
                        req.flash('success', 'Delete product successfully!');
                        return res.redirect('back');
                    })
                    .catch(err => {
                        req.flash('errors', {msg: err.message});
                        res.redirect('back');
                    })
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('back');
            })
    }
}