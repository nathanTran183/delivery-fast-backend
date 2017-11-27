'use strict';

/**
 * Created by nathan on 08/11/2017.
 */
var Response = require('../../helpers/Response');
var httpStatus = require('http-status');

module.exports = {
    test: function test(req, res) {
        // Execute function

        // Emit socket
        emitter.emit('test', { msg: 'Hello' });
        return res.json(Response.returnSuccess("Successfully!", { msg: 'Hello' }));
    }
};