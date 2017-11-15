/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 11/10/2017.
 */
const Discount = require('../../models/index').Discount;
const httpStatus = require('http-status');
const config = require('../../config/index');
const Response = require('../../helpers/response');
module.exports = {
    check(req, res) {
        let storeId = req.query.storeId;
        let code = req.query.code;
        let date = new Date();
        if (storeId == undefined || code == undefined) {
            return res.json(Response.returnError("Require Store id and discount code"));
        } else {
            Discount
                .find({
                    where: {
                        store_id: storeId,
                        code: code
                    }
                })
                .then(discount => {
                    if (!discount)
                        return res.json(Response.returnError("Invalid code!"), httpStatus.BAD_REQUEST);
                    else {
                        let expireDate = new Date(discount.expire_date);
                        expireDate.setHours(23, 59, 59, 999);
                        if (discount.start_date < new Date() && expireDate > new Date())
                            return res.json(Response.returnSuccess("Code is valid", {}));
                        else res.json(Response.returnError("Code is expired or not applied yet!", httpStatus.BAD_REQUEST));
                    }
                })
                .catch(error => {
                    res.json(Response.returnError(error.message, error.code));
                })
        }
    },

    list(req, res){
        Discount
            .all()
            .then(discount => {
                return res.json(Response.returnSuccess("Get list discounts successfully!", discount))
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code));
            })
    }
}