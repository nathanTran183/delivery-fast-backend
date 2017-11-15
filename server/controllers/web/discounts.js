/**
 * Created by nathan on 12/11/2017.
 */
const Discount = require('../../models/index').Discount;
const Store = require('../../models/index').Store;
const config = require('../../config/index');
const randomize = require('randomatic');
const validate = require('../../helpers/validate');
module.exports = {
    list(req, res) {
        Discount
            .all({
                include: [
                    {
                        model: Store,
                        as: 'store'
                    }
                ],
                order: 'start_date DESC'
            })
            .then(discounts => {
                Store
                    .all({
                        where: {
                            status: true
                        }
                    })
                    .then(stores => {
                        return res.render("orders/discount", {discounts: discounts, stores: stores})
                    })
                    .catch(err => {
                        req.flash('reason-fail', err.message);
                        res.redirect('/discounts');
                    })

            })
            .catch(err => {
                req.flash('reason-fail', err.message);
                res.redirect('/discounts');
            })
    },

    create(req, res) {
        console.log(req.body);
        req.assert('code', 'Discount code is required!').notEmpty();
        req.assert('percentage', 'Discount percentage is required!').notEmpty();
        req.assert('start_date', 'Discount start date is required!').notEmpty();
        req.assert('expire_date', 'Discount expire date is required!').notEmpty();
        req.assert('percentage', 'Discount percentage is number only!').isNumeric();
        var errors = req.validationErrors();
        if(validate.isDate(req.body.start_date) == false){
            errors = validate.addErrorAssert("Start date must be date format!", errors);
        } else {
            var startDate = new Date(req.body.start_date);
            req.body.start_date = startDate.getFullYear() + "/" + (startDate.getMonth() + 1) + "/" + startDate.getDate();
        }

        if(validate.isDate(req.body.expire_date) == false){
            errors = validate.addErrorAssert("Expire date must be date format!", errors);
        } else {
            var expireDate = new Date(req.body.expire_date);
            req.body.expire_date = expireDate.getFullYear() + "/" + (expireDate.getMonth() + 1) + "/" + expireDate.getDate();
        }
        if(startDate!=undefined){
            let date = new Date();
            if(startDate <= date){
                errors = validate.addErrorAssert("Start date must be greater than today!", errors);
            }
        }
        if (errors) {   //Display errors to user
            req.flash('errors', errors);
            res.redirect('back');
            return;
        }

        Discount
            .create(req.body)
            .then(discount => {
                req.flash('success', 'Create discount successfully!');
                return res.redirect('/discounts');
            })
            .catch(err => {
                req.flash('errors', {msg: err.message});
                res.redirect('/discounts');
            })
    },

    delete(req, res) {
        Discount
            .findById(req.params.discountId)
            .then(discount => {
                if (!discount) {
                    req.flash('reason-fail', 'Discount not found!');
                    res.redirect('/discounts');
                } else {
                    discount
                        .destroy()
                        .then(() => {
                            req.flash('success', 'Delete discount successfully!');
                            return res.redirect('/discounts');
                        })
                        .catch(err => res.json(err))
                }
            })
            .catch(err => res.json(err))
    },

    generateCode(req, res) {
        return res.json(randomize('Aa0', 8));
    }
}