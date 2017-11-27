/**
 * Created by nathan on 13/11/2017.
 */
/**
 * Created by nathan on 11/10/2017.
 */
const Notification = require('../../models/index').Notification;
const httpStatus = require('http-status');
const config = require('../../config/index');
const Response = require('../../helpers/Response');
module.exports = {
    list(req, res){
        Notification
            .all({
                where: {user_id: req.user.id}
            })
            .then(notifications => {
                return res.json(Response.returnSuccess("Get list discounts successfully!", {notifications: notifications}))
            })
            .catch(error => {
                res.json(Response.returnError(error.message, error.code));
            })
    }
}