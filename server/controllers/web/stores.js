/**
 * Created by nathan on 17/10/2017.
 */
const Store = require('../../models/index').Store;
const StoreType = require('../../models/index').StoreType;
const Response = require('../../helpers/response');
const httpStatus = require('http-status');
const multer = require('multer');
var path = require('path')

module.exports = {
    get(req, res) {
        Store
            .findById(req.params.storeId)
            .then(store => {
                if(!store)
                    return res.json(Response.returnError('Store not found!', httpStatus.NOT_FOUND));
                return res.json(Response.returnSuccess('Retrieve store successfully!', {store: store}))
            })
            .catch(err => res.json(Response.returnError(err.message, err.code)))
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
            destination: function(req, file, callback) {
                callback(null, 'server/publics/uploads')
            },
            filename: function(req, file, callback) {
                callback(null, req.body.name + '-' + Date.now() + path.extname(file.originalname))
            }
        });

        var upload = multer({
            storage: storage,
            fileFilter: function(req, file, callback) {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false);
                }
                callback(null, true)
            }
        }).single('image_url');
        upload(req, res, function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('------------');
                console.log(req.body);
                console.log(req.file)
                res.end('File is uploaded')
            }

        })

        console.log('asasas');
        // Store
        //     .create(req.body)
        //     .then(store => {
        //         return res.json(Response.returnSuccess('Create store successfully!', {store: store}));
        //     })
        //     .catch(err => {
        //         res.json(Response.returnError(err.message,err.code))
        //     })
    },

    update(req, res) {

    },

    add(req, res) {
        StoreType
            .all()
            .then(storeTypes => {
                return res.render('stores/create', {storeTypes: storeTypes});
            })
            .catch(err => res.json(err))
    }
}