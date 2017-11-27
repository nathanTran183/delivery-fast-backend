/**
 * Created by nathan on 08/11/2017.
 */
const Response = require('../../helpers/Response');
const httpStatus = require('http-status');

module.exports = {
    test(req, res) {
        // Execute function

        // Emit socket
        emitter.emit('test', {msg: 'Hello'});
        return res.json(Response.returnSuccess("Successfully!", {msg: 'Hello'}));
    },
};