module.exports = {

    returnSuccess(message, data) {
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

    returnError(message, code) {
        return {
            status: false,
            error: {
                message: message,
                code: code
            }
        };
    }

};