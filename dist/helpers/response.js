"use strict";

module.exports = {
    returnSuccess: function returnSuccess(message, data) {
        return {
            status: true,
            message: message,
            data: data
        };
    },


    // returnSuccess(message) {
    // 	return {
    // 	    status: true,
    // 		message: message
    // 	};
    // },

    returnError: function returnError(message, code) {
        return {
            status: false,
            error: {
                message: message,
                code: code
            }
        };
    }
};