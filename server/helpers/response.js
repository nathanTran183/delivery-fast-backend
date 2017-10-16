module.exports = {

    returnSuccess(message, data) {
        return {
            status: true,
            message: message,
            data: data
        };
    },

	returnSuccess(data) {
		return {
		    status: true,
			data: data
		};
	},

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