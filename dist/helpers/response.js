"use strict";

module.exports = {
    returnSuccess: function returnSuccess(message, data) {
        return {
            status: true,
            message: message,
            data: data
        };
    },
    returnError: function returnError(message, code) {
        return {
            status: false,
            message: message,
            error: {
                code: code
            }
        };
    }
};